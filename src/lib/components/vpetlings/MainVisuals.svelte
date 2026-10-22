<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import screenshot1 from '$lib/assets/vpetlings/screenshots/screenshot_1.webp';
	import screenshot2 from '$lib/assets/vpetlings/screenshots/screenshot_2.webp';
	import screenshot3 from '$lib/assets/vpetlings/screenshots/screenshot_3.webp';
	import screenshot4 from '$lib/assets/vpetlings/screenshots/screenshot_4.webp';
	import screenshot5 from '$lib/assets/vpetlings/screenshots/screenshot_5.webp';
	import screenshot6 from '$lib/assets/vpetlings/screenshots/screenshot_6.webp';
	import screenshot7 from '$lib/assets/vpetlings/screenshots/screenshot_7.webp';
	import screenshot8 from '$lib/assets/vpetlings/screenshots/screenshot_8.webp';

	const images = [
		screenshot1,
		screenshot2,
		screenshot3,
		screenshot4,
		screenshot5,
		screenshot6,
		screenshot7,
		screenshot8
	];

	let index = 0;
	let interval: number | undefined;
	let hasStarted = false;
	let container: HTMLElement;

	type ArrowZoneProps = {
		side: 'left' | 'right';
		label: string;
		onClick: () => void;
		symbol: string;
	};

	function next() {
		index = (index + 1) % images.length;
	}

	function prev() {
		index = (index - 1 + images.length) % images.length;
	}

	function startInterval() {
		if (interval) return;
		interval = window.setInterval(next, 3000);
	}

	function resetInterval() {
		if (!hasStarted) return;
		clearInterval(interval);
		interval = window.setInterval(next, 3000);
	}

	onMount(() => {
		for (const src of images) {
			const image = new Image();
			image.src = src;
			void image.decode?.().catch(() => {});
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasStarted) {
					hasStarted = true;
					startInterval();
					observer.disconnect();
				}
			},
			{
				threshold: 0.25 // user must see at least 25% of the carousel
			}
		);

		observer.observe(container);

		return () => observer.disconnect();
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

{#snippet arrowZone({ side, label, onClick, symbol }: ArrowZoneProps)}
	<button
		type="button"
		aria-label={label}
		onclick={() => {
			onClick();
			resetInterval();
		}}
		class="
			group absolute top-0 h-full w-16 cursor-pointer border-0 bg-transparent p-0 select-none
			{side === 'left' ? 'left-0' : 'right-0'}
		"
	>
		<span
			class="
				absolute top-1/2 -translate-y-1/2
				text-2xl font-bold text-text opacity-60
				transition group-hover:opacity-100
				group-active:opacity-100
				md:text-4xl
				{side === 'left' ? 'left-4' : 'right-4'}
			"
		>
			{symbol}
		</span>
	</button>
{/snippet}

<section class="w-full">
	<div bind:this={container} class="relative mx-auto w-full md:w-5/6">
		<img
			src={images[index]}
			alt="VPetlings gameplay screenshot"
			class="w-full rounded border-2 border-text object-contain"
			loading="lazy"
			decoding="async"
		/>

		{@render arrowZone({
			side: 'left',
			label: 'Previous image',
			onClick: prev,
			symbol: '<'
		})}

		{@render arrowZone({
			side: 'right',
			label: 'Next image',
			onClick: next,
			symbol: '>'
		})}
	</div>

	<div class="mt-4 flex w-full justify-center gap-1 md:gap-2">
		{#each images as image, i (image)}
			<button
				aria-label={`Select image ${i + 1}`}
				onclick={() => {
					index = i;
					resetInterval();
				}}
				class="group relative flex h-5 w-5 cursor-pointer items-center justify-center"
			>
				<span
					class="
					block h-3 w-3 border-2 border-text
					transition ease-out group-hover:-rotate-45
					md:h-4 md:w-4
					{i === index ? '!rotate-45 bg-secondary' : 'bg-accent-dark'}
				"
				></span>
			</button>
		{/each}
	</div>
</section>
