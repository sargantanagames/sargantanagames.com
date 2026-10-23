<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';

	type Variant =
		'screenshot' | 'logo' | 'wordmark' | 'wordmark-black' | 'artwork' | 'key-art' | 'gif';
	type Props = {
		src: string;
		alt: string;
		previewSrc?: string;
		variant?: Variant;
	};

	let { src, alt, previewSrc, variant = 'screenshot' }: Props = $props();

	let filename = $derived(decodeURIComponent(src.split('/').pop() ?? src));
	let assetUrl = $derived(asset(src));
	let dimensions = $state('');
	let fileSize = $state('');

	function formatFileSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
		return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MB`;
	}

	onMount(() => {
		const image = new Image();
		image.onload = () => {
			dimensions = `${image.naturalWidth} × ${image.naturalHeight}`;
		};
		image.src = assetUrl;

		void fetch(assetUrl, { method: 'HEAD' })
			.then((response) => Number(response.headers.get('content-length')))
			.then((contentLength) => {
				if (Number.isFinite(contentLength) && contentLength > 0) {
					fileSize = formatFileSize(contentLength);
				}
			})
			.catch(() => {});
	});
</script>

<a class="asset" href={asset(src)} download aria-label={`Download ${filename}`}>
	<div class="preview" data-variant={variant}>
		<img
			src={previewSrc ?? assetUrl}
			{alt}
			loading="lazy"
			class:pixelated={variant !== 'screenshot'}
		/>
		<span class="download-overlay" aria-hidden="true">Click to download ↓</span>
	</div>

	<div class="metadata">
		<div class="asset-info">
			<p class="filename" title={filename}>{filename}</p>
			<p class="details">
				{#if dimensions}<span>{dimensions}</span>{/if}
				{#if fileSize}<span class="file-size">{fileSize}</span>{/if}
			</p>
		</div>
	</div>
</a>

<style>
	.asset {
		display: block;
		overflow: hidden;
		border: 2px solid var(--color-text);
		border-radius: 0.25rem;
		background: var(--color-whitish);
		cursor: pointer;
		transition: border-color 160ms ease;
	}

	.asset:hover,
	.asset:focus-visible {
		border-color: var(--color-accent-darker);
		outline: none;
	}

	.preview {
		position: relative;
		display: flex;
		overflow: hidden;
		align-items: center;
		justify-content: center;
		border-bottom: 2px solid var(--color-text);
		background: var(--color-accent);
	}

	.preview[data-variant='screenshot'] img {
		display: block;
		width: 100%;
	}

	.preview[data-variant='logo'],
	.preview[data-variant='wordmark'],
	.preview[data-variant='wordmark-black'] {
		height: 10rem;
		padding: 1.25rem;
	}

	.preview[data-variant='logo'] img {
		width: min(90%, 22rem);
		object-fit: contain;
	}

	.preview[data-variant='wordmark'] {
		background: var(--color-secondary);
	}

	.preview[data-variant='wordmark-black'] {
		background: var(--color-whitish);
	}

	.preview[data-variant='wordmark'] img,
	.preview[data-variant='wordmark-black'] img {
		width: min(90%, 24rem);
		object-fit: contain;
	}

	.preview[data-variant='artwork'] {
		height: 19rem;
		padding: 0.75rem;
	}

	.preview[data-variant='artwork'] img {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}

	.preview[data-variant='key-art'] {
		height: 14rem;
		padding: 0.5rem;
	}

	.preview[data-variant='gif'] {
		height: 10rem;
		padding: 0.5rem;
	}

	.preview[data-variant='key-art'] img,
	.preview[data-variant='gif'] img {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}

	.download-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--color-secondary) 28%, transparent);
		color: var(--color-whitish);
		font-size: 1.75rem;
		text-shadow: 1px 1px 0 var(--color-secondary);
		opacity: 0;
		transition: opacity 160ms ease;
	}

	.asset:hover .download-overlay,
	.asset:focus-visible .download-overlay {
		opacity: 1;
	}

	.metadata {
		display: flex;
		min-height: 3.5rem;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.45rem 0.7rem;
	}

	.asset-info {
		min-width: 0;
		width: 100%;
	}

	.filename {
		overflow: hidden;
		font-size: 1.05rem;
		line-height: 1.1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.details {
		display: flex;
		min-height: 1rem;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.15rem;
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.65;
	}

	.file-size {
		color: var(--color-accent-darker);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.asset,
		.download-overlay {
			transition: none;
		}
	}
</style>
