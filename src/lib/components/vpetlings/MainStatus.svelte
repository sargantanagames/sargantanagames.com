<script>
	import { resolve } from '$app/paths';
	import { LINKS } from '$lib/config/links';
</script>

<section class="space-y-4 text-center">
	<div class="flex items-end justify-center text-3xl">
		<span>In development</span>
		<span class="build-dots">
			<span>.</span><span>.</span><span>.</span>
		</span>
	</div>

	<p class="text-xl">
		VPetlings is actively being worked on.
		<a
			href={LINKS.vpetlings.steam}
			target="_blank"
			rel="external noopener noreferrer"
			class="underline-center text-accent-darker"
		>
			Wishlist on Steam
		</a>
		to follow development and support the project.
	</p>

	<div>
		<iframe
			src="https://store.steampowered.com/widget/3799160/"
			frameborder="0"
			width="646"
			height="190"
			loading="lazy"
			title="VPetlings Steam widget"
			class="mx-auto max-w-full rounded"
		></iframe>
	</div>

	<p class="text-base">
		Want to learn more about us?
		<a href={resolve('/vpetlings/about-us')} class="underline-center text-accent-darker">
			Read about the "studio"
		</a>.
	</p>
</section>

<style>
	.build-dots span {
		display: inline-block;
		animation: dot-jump 1s infinite ease-in-out both;
	}

	.build-dots span:nth-child(1) {
		animation-delay: 0s;
	}

	.build-dots span:nth-child(2) {
		animation-delay: 0.1s;
	}

	.build-dots span:nth-child(3) {
		animation-delay: 0.2s;
	}

	@keyframes dot-jump {
		0%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-2px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.build-dots span {
			animation: none;
		}
	}
</style>
