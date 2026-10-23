<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import vpetlingsLogo from '$lib/assets/vpetlings/vpetlings-logo.webp';
	import PressAsset from '$lib/components/vpetlings/PressAsset.svelte';
	import { LINKS } from '$lib/config/links';
	import pressKit from '$lib/data/vpetlings-press-kit.json';

	const bundleUrl = asset(pressKit.bundle.src);
	const trailerUrl = asset(pressKit.trailer.src);

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
	<title>{pressKit.title} · Sargantana Games</title>
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
	</section>

	<section class="max-w-3xl space-y-8">
		<div class="space-y-3">
			<h2 class="text-center text-3xl">Short description</h2>
			<p class="description-copy text-2xl">
				{#each pressKit.shortDescription as segment, index (index)}
					{#if segment.accent}<span class="text-accent-darker">{segment.text}</span
						>{:else}{segment.text}{/if}
				{/each}
			</p>
		</div>

		<div class="space-y-3">
			<h2 class="text-center text-3xl">Long description</h2>
			<div class="description-copy space-y-4 text-2xl">
				{#each pressKit.longDescription as paragraph, paragraphIndex (paragraphIndex)}
					<p>
						{#each paragraph as segment, segmentIndex (segmentIndex)}
							{#if segment.accent}<span class="text-accent-darker">{segment.text}</span
								>{:else}{segment.text}{/if}
						{/each}
					</p>
				{/each}
			</div>
		</div>
	</section>

	<section class="w-full max-w-3xl space-y-5">
		<h2 class="text-center text-3xl">Quick facts</h2>

		<dl class="grid border-y-2 border-text text-xl sm:grid-cols-2">
			{#each pressKit.facts as fact (fact.label)}
				<div class="fact">
					<dt>{fact.label}</dt>
					<dd>
						{#if fact.link === 'steam'}
							<a
								href={LINKS.vpetlings.steam}
								target="_blank"
								rel="external noopener noreferrer"
								class="underline-center text-accent-darker"
							>
								{fact.value}
							</a>
						{:else}
							{fact.value}
						{/if}
					</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="max-w-3xl space-y-5 text-center">
		<h2 class="text-3xl">Key features</h2>
		<ul class="feature-list text-left text-xl">
			{#each pressKit.features as feature (feature)}
				<li>{feature}</li>
			{/each}
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
			<a href={trailerUrl}>{pressKit.trailer.alt}</a>
		</video>

		<a href={trailerUrl} download class="underline-center text-xl text-accent-darker">
			Download trailer
		</a>
	</section>

	<div class="text-center">
		<a class="download-all" href={bundleUrl} download>
			Download all assets{bundleSize ? ` · ${bundleSize}` : ''}
		</a>
	</div>

	<section class="w-full space-y-10">
		<div class="space-y-4">
			<h2 class="text-center text-3xl">Logos</h2>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each pressKit.assets.logos as logo (logo.src)}
					<PressAsset
						src={logo.src}
						previewSrc={logo.preview === 'site-logo' ? vpetlingsLogo : undefined}
						alt={logo.alt}
						variant={logo.variant === 'logo'
							? 'logo'
							: logo.variant === 'wordmark-black'
								? 'wordmark-black'
								: 'wordmark'}
					/>
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">Screenshots</h2>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each pressKit.assets.screenshots as screenshot (screenshot.src)}
					<PressAsset src={screenshot.src} alt={screenshot.alt} />
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">Key art</h2>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each pressKit.assets.keyArt as artwork (artwork.src)}
					<PressAsset src={artwork.src} alt={artwork.alt} variant="key-art" />
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">GIFs</h2>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each pressKit.assets.gifs as gif (gif.src)}
					<PressAsset src={gif.src} alt={gif.alt} variant="gif" />
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="text-center text-3xl">Art assets</h2>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each pressKit.assets.artAssets as artwork (artwork.src)}
					<PressAsset src={artwork.src} alt={artwork.alt} variant="key-art" />
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
		<p class="text-xl">{pressKit.contact.prompt}</p>
		<a
			href={`mailto:${pressKit.contact.email}`}
			class="underline-center text-xl text-accent-darker"
		>
			{pressKit.contact.email}
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
