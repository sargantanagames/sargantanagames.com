<script lang="ts">
	import { asset } from '$app/paths';
	import trailerPoster from '$lib/assets/vpetlings/screenshots/screenshot_1.webp';

	const trailerUrl = asset('/press-kit/video/vpetlings-announcement-trailer.mp4');
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
		<a href={trailerUrl}> Watch the VPetlings announcement trailer </a>
	</video>
</section>
