<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import vpetlingsLogo from '$lib/assets/vpetlings/vpetlings-logo.webp';
	import PressAsset from '$lib/components/vpetlings/PressAsset.svelte';
	import { LINKS } from '$lib/config/links';

	const bundleUrl = asset('/press-kit/vpetlings-press-kit.zip');
	const trailerUrl = asset('/press-kit/video/vpetlings-announcement-trailer.mp4');
	const screenshots = [
		{
			src: '/press-kit/screenshots/vpetlings-desktop-companion.png',
			alt: 'A VPetling living alongside the desktop interface'
		},
		{
			src: '/press-kit/screenshots/vpetlings-upgrades.png',
			alt: 'VPetling upgrades and stat training menu'
		},
		{
			src: '/press-kit/screenshots/vpetlings-world-map.png',
			alt: 'A VPetling exploring the world map'
		},
		{
			src: '/press-kit/screenshots/vpetlings-battle.png',
			alt: 'Two VPetlings taking part in a battle'
		},
		{
			src: '/press-kit/screenshots/vpetlings-furniture.png',
			alt: 'Furniture selection and room customization'
		},
		{
			src: '/press-kit/screenshots/vpetlings-feeding.png',
			alt: 'Feeding a VPetling with the mouse cursor'
		},
		{
			src: '/press-kit/screenshots/vpetlings-training.png',
			alt: 'Training and upgrading a VPetling'
		}
	];

	const keyArt = [
		{
			src: '/press-kit/key-art/vpetlings-key-art-landscape-1920x1080.png',
			alt: 'Landscape VPetlings key art'
		},
		{
			src: '/press-kit/key-art/vpetlings-key-art-portrait-748x896.png',
			alt: 'Portrait VPetlings key art'
		},
		{
			src: '/press-kit/key-art/vpetlings-key-art-banner-920x430.png',
			alt: 'Wide VPetlings banner art'
		}
	];

	const gifs = [
		{
			src: '/press-kit/gifs/vpetlings-egg-evolutions.gif',
			alt: 'VPetling eggs and evolution stages'
		},
		{
			src: '/press-kit/gifs/vpetlings-pet-behaviours.gif',
			alt: 'A selection of VPetling behaviours'
		},
		{
			src: '/press-kit/gifs/vpetlings-room-colors.gif',
			alt: 'Different VPetling room color themes'
		}
	];

	let bundleSize = '';

	function formatMegabytes(bytes: number) {
		return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MB`;
	}

	onMount(async () => {
		try {
			const response = await fetch(bundleUrl, { method: 'HEAD' });
			const contentLength = Number(response.headers.get('content-length'));
			if (Number.isFinite(contentLength) && contentLength > 0) {
				bundleSize = formatMegabytes(contentLength);
			}
		} catch {
			// The download still works if a host does not return Content-Length for HEAD requests.
		}
	});
</script>

<svelte:head>
	<title>VPetlings Press Kit · Sargantana Games</title>
	<meta
		name="description"
		content="Official VPetlings press kit with game information, logos, screenshots, key art, GIFs, and trailer."
	/>
</svelte:head>

<div class="my-12 flex flex-col items-center gap-16">
	<section class="max-w-3xl space-y-6 text-center">
		<img
			src={vpetlingsLogo}
			alt="VPetlings"
			class="pixelated mx-auto h-24 object-contain md:h-32"
		/>

		<h1 class="text-4xl">Press Kit</h1>

		<a class="download-all" href={bundleUrl} download>
			Download all assets{bundleSize ? ` · ${bundleSize}` : ''}
		</a>
	</section>

	<section class="max-w-3xl space-y-8">
		<div class="space-y-3">
			<h2 class="text-center text-3xl">Short description</h2>
			<p class="description-copy text-2xl">
				VPetlings is a cozy virtual pet that <span class="text-accent-darker"
					>lives on your desktop</span
				>. Hatch a little companion, care for them, play together, decorate their room, and raise
				them across generations as they <span class="text-accent-darker">evolve</span> and
				<span class="text-accent-darker">train for battle</span>.
			</p>
		</div>

		<div class="space-y-3">
			<h2 class="text-center text-3xl">Long description</h2>
			<div class="description-copy space-y-4 text-2xl">
				<p>
					VPetlings is a desktop virtual pet game about <span class="text-accent-darker"
						>raising a small creature from an egg</span
					>. Each companion wanders around the desktop, eats, sleeps, interacts with the cursor,
					plays, and develops its own
					<span class="text-accent-darker">moods, stats, and sleep patterns</span>. Players can care
					for their pet throughout the day or send them to rest in their room when they need to
					focus.
				</p>

				<p>
					Pets gain experience and evolve over time. At the end of a generation, they can be reborn
					into a new egg with a head start toward discovering more creatures. Players can decorate
					their room, unlock color variants, train their stats, explore small worlds, and take part
					in timing-based battles. VPetlings combines the care of
					<span class="text-accent-darker">Tamagotchi</span>, the evolutions and battles of
					<span class="text-accent-darker">Digimon V-Pets</span>, and the charm of old
					<span class="text-accent-darker">desktop pets</span>.
				</p>
			</div>
		</div>
	</section>

	<section class="w-full max-w-3xl space-y-5">
		<h2 class="text-center text-3xl">Quick facts</h2>

		<dl class="grid border-y-2 border-text text-xl sm:grid-cols-2">
			<div class="fact">
				<dt>Studio</dt>
				<dd>Sargantana Games</dd>
			</div>
			<div class="fact">
				<dt>Based in</dt>
				<dd>Spain</dd>
			</div>
			<div class="fact">
				<dt>Release</dt>
				<dd>2027</dd>
			</div>
			<div class="fact">
				<dt>Platforms</dt>
				<dd>Windows and Linux</dd>
			</div>
			<div class="fact">
				<dt>Price</dt>
				<dd>&lt 10€</dd>
			</div>
			<div class="fact">
				<dt>Genre</dt>
				<dd>Desktop virtual pet</dd>
			</div>
			<div class="fact">
				<dt>Players</dt>
				<dd>Single-player</dd>
			</div>
			<div class="fact">
				<dt>Availability</dt>
				<dd>
					<a
						href={LINKS.vpetlings.steam}
						target="_blank"
						rel="external noopener noreferrer"
						class="underline-center text-accent-darker"
					>
						Wishlist on Steam
					</a>
				</dd>
			</div>
		</dl>
	</section>

	<section class="max-w-3xl space-y-5 text-center">
		<h2 class="text-3xl">Key features</h2>
		<ul class="feature-list text-left text-xl">
			<li>A virtual pet that roams, rests, and plays directly on your desktop</li>
			<li>Care, play, room decoration, color variants, and distinct personalities</li>
			<li>Multiple generations of creatures to evolve and discover</li>
			<li>Stats, training, small worlds, and timing-based battles</li>
			<li>Designed to provide company while working, playing, or browsing</li>
		</ul>
	</section>

	<section class="w-full space-y-5 text-center">
		<h2 class="text-3xl">Trailer</h2>

		<video
			class="w-full rounded border-2 border-text bg-secondary"
			controls
			preload="metadata"
			playsinline
		>
			<source src={trailerUrl} type="video/mp4" />
			<a href={trailerUrl}>Download the VPetlings announcement trailer</a>
		</video>

		<a href={trailerUrl} download class="underline-center text-xl text-accent-darker">
			Download trailer
		</a>
	</section>

	<section class="w-full space-y-10">
		<div class="space-y-4">
			<h2 class="text-center text-3xl">Logos</h2>

			<div class="grid gap-4 sm:grid-cols-2">
				<PressAsset
					src="/press-kit/logos/vpetlings-logo-primary.png"
					previewSrc={vpetlingsLogo}
					alt="Full-color VPetlings logo"
					variant="logo"
				/>
				<PressAsset
					src="/press-kit/logos/vpetlings-wordmark-white.png"
					alt="White VPetlings wordmark"
					variant="wordmark"
				/>
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">Screenshots</h2>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each screenshots as screenshot (screenshot.src)}
					<PressAsset src={screenshot.src} alt={screenshot.alt} />
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">Key art</h2>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each keyArt as artwork (artwork.src)}
					<PressAsset src={artwork.src} alt={artwork.alt} variant="key-art" />
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">GIFs</h2>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each gifs as gif (gif.src)}
					<PressAsset src={gif.src} alt={gif.alt} variant="gif" />
				{/each}
			</div>
		</div>

		<div class="text-center">
			<a class="download-all" href={bundleUrl} download>
				Download all assets{bundleSize ? ` · ${bundleSize}` : ''}
			</a>
		</div>
	</section>

	<section class="max-w-2xl space-y-4 text-center">
		<h2 class="text-3xl">Need anything else?</h2>
		<p class="text-xl">
			For review keys, interviews, or another asset format, email us directly at
		</p>
		<a
			href="mailto:contact@sargantanagames.com"
			class="underline-center text-xl text-accent-darker"
		>
			contact@sargantanagames.com
		</a>
	</section>
</div>

<style>
	.download-all {
		display: inline-block;
		border: 2px solid var(--color-text);
		border-radius: 0.25rem;
		background: var(--color-accent-dark);
		padding: 0.55rem 1.35rem;
		color: var(--color-whitish);
		font-size: 1.5rem;
		transition: background-color 160ms ease;
	}

	.download-all:hover,
	.download-all:focus-visible {
		background: var(--color-accent-darker);
	}

	.description-copy {
		text-align: justify;
		text-wrap: pretty;
	}

	.fact {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-text) 25%, transparent);
	}

	.fact dt {
		opacity: 0.65;
	}

	.feature-list {
		display: grid;
		gap: 0.4rem 1.5rem;
		max-width: 42rem;
		margin-inline: auto;
	}

	.feature-list li {
		position: relative;
		padding-left: 1rem;
	}

	.feature-list li::before {
		content: '›';
		position: absolute;
		left: 0;
		color: var(--color-accent-darker);
	}

	@media (min-width: 640px) {
		.fact:nth-last-child(-n + 2) {
			border-bottom: 0;
		}

		.fact:nth-child(odd) {
			border-right: 1px solid color-mix(in srgb, var(--color-text) 25%, transparent);
		}
	}

	@media (max-width: 639px) {
		.fact:last-child {
			border-bottom: 0;
		}
	}
</style>
