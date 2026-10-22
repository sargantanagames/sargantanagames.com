import { deflateRawSync } from 'node:zlib';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const staticRoot = join(root, 'static');
const manifest = JSON.parse(
	await readFile(join(root, 'src/lib/data/vpetlings-press-kit.json'), 'utf8')
);

const plainText = (segments) => segments.map(({ text }) => text).join('');

function wrap(text, width = 76) {
	const words = text.split(/\s+/);
	const lines = [];
	let line = '';

	for (const word of words) {
		if (!line) line = word;
		else if (`${line} ${word}`.length <= width) line += ` ${word}`;
		else {
			lines.push(line);
			line = word;
		}
	}

	if (line) lines.push(line);
	return lines.join('\n');
}

function section(title, body) {
	return `${title}\n${'-'.repeat(title.length)}\n\n${body}`;
}

const readme =
	[
		`${manifest.title.toUpperCase()}\n${'='.repeat(manifest.title.length)}`,
		section('SHORT DESCRIPTION', wrap(plainText(manifest.shortDescription))),
		section(
			'ABOUT THE GAME',
			manifest.longDescription.map((paragraph) => wrap(plainText(paragraph))).join('\n\n')
		),
		section('FEATURES', manifest.features.map((feature) => `- ${feature}`).join('\n')),
		section(
			'QUICK FACTS',
			[
				...manifest.facts.map(({ label, value }) => `${label}: ${value}`),
				`Steam App ID: ${manifest.steamAppId}`
			].join('\n')
		),
		section('CONTACT', manifest.contact.email),
		section('CONTENTS', manifest.contents.map((item) => `- ${item}`).join('\n'))
	].join('\n\n') + '\n';

const readmePath = join(staticRoot, manifest.bundle.readme.replace('/press-kit/', 'press-kit/'));
await writeFile(readmePath, readme);

const visibleAssets = [
	...manifest.assets.logos,
	...manifest.assets.screenshots,
	...manifest.assets.keyArt,
	...manifest.assets.gifs
].map(({ src }) => src);

const assetPaths = [...visibleAssets, ...manifest.assets.bundleOnly, manifest.trailer.src].map(
	(src) => ({
		name: src.replace('/press-kit/', ''),
		path: join(staticRoot, src.slice(1))
	})
);

const archiveEntries = [
	{ name: 'README.txt', data: Buffer.from(readme) },
	...(await Promise.all(
		assetPaths.map(async ({ name, path }) => ({ name, data: await readFile(path) }))
	))
];

const crcTable = Array.from({ length: 256 }, (_, value) => {
	let crc = value;
	for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
	return crc >>> 0;
});

function crc32(data) {
	let crc = 0xffffffff;
	for (const byte of data) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
	return (crc ^ 0xffffffff) >>> 0;
}

function createZip(entries) {
	const localParts = [];
	const centralParts = [];
	let offset = 0;

	for (const { name, data } of entries) {
		const nameBuffer = Buffer.from(name);
		const compressed = deflateRawSync(data, { level: 9 });
		const useCompression = compressed.length < data.length;
		const payload = useCompression ? compressed : data;
		const method = useCompression ? 8 : 0;
		const checksum = crc32(data);

		const localHeader = Buffer.alloc(30);
		localHeader.writeUInt32LE(0x04034b50, 0);
		localHeader.writeUInt16LE(20, 4);
		localHeader.writeUInt16LE(0x0800, 6);
		localHeader.writeUInt16LE(method, 8);
		localHeader.writeUInt16LE(0x0021, 12);
		localHeader.writeUInt32LE(checksum, 14);
		localHeader.writeUInt32LE(payload.length, 18);
		localHeader.writeUInt32LE(data.length, 22);
		localHeader.writeUInt16LE(nameBuffer.length, 26);

		const centralHeader = Buffer.alloc(46);
		centralHeader.writeUInt32LE(0x02014b50, 0);
		centralHeader.writeUInt16LE(20, 4);
		centralHeader.writeUInt16LE(20, 6);
		centralHeader.writeUInt16LE(0x0800, 8);
		centralHeader.writeUInt16LE(method, 10);
		centralHeader.writeUInt16LE(0x0021, 14);
		centralHeader.writeUInt32LE(checksum, 16);
		centralHeader.writeUInt32LE(payload.length, 20);
		centralHeader.writeUInt32LE(data.length, 24);
		centralHeader.writeUInt16LE(nameBuffer.length, 28);
		centralHeader.writeUInt32LE(offset, 42);

		localParts.push(localHeader, nameBuffer, payload);
		centralParts.push(centralHeader, nameBuffer);
		offset += localHeader.length + nameBuffer.length + payload.length;
	}

	const centralDirectory = Buffer.concat(centralParts);
	const end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0);
	end.writeUInt16LE(entries.length, 8);
	end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(centralDirectory.length, 12);
	end.writeUInt32LE(offset, 16);

	return Buffer.concat([...localParts, centralDirectory, end]);
}

const bundlePath = join(staticRoot, manifest.bundle.src.slice(1));
const temporaryBundlePath = `${bundlePath}.tmp`;
await writeFile(temporaryBundlePath, createZip(archiveEntries));
await rename(temporaryBundlePath, bundlePath);

console.log(`Generated ${manifest.bundle.readme} and ${manifest.bundle.src}`);
