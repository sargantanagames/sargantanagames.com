<script lang="ts">
	import { asset } from '$app/paths';
	import trailerPoster from '$lib/assets/vpetlings/screenshots/screenshot_1.webp';
	import pressKit from '$lib/data/vpetlings-press-kit.json';

	const trailerUrl = asset(pressKit.trailer.src);
</script>

<section class="w-full space-y-4 text-center">
	<video
		class="w-full rounded border-2 border-text bg-secondary"
		controls
		preload="metadata"
		playsinline
		poster={trailerPoster}
	>
		<source src={trailerUrl} type="video/mp4" />
		<a href={trailerUrl}>{pressKit.trailer.alt}</a>
	</video>
</section>
