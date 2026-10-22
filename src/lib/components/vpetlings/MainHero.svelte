<script lang="ts">
	import vpetlingsLogo from '$lib/assets/vpetlings/vpetlings-logo.webp';
	import capsuleImage from '$lib/assets/vpetlings/capsule.png';
</script>

<section class="space-y-16">
	<div class="flex justify-center">
		<img
			src={vpetlingsLogo}
			alt="VPetlings"
			class="logo-bob pixelated h-24 object-contain md:h-32"
		/>
	</div>

	<div class="flex flex-col items-center justify-between gap-8 text-center md:flex-row">
		<div>
			<h2 class="text-4xl">
				Your virtual pet, <span class="text-accent-darker">right on your desktop</span>.
			</h2>
			<p class="text-2xl">
				Hatch a little companion, take care of them, play together,
				<span class="text-accent-darker">train them for battle</span>, and help them
				<span class="text-accent-darker">evolve</span>. They’ll stay nearby,
				<span class="text-accent-darker">keeping you company</span> while you work, play, or browse.
			</p>
		</div>
		<img src={capsuleImage} alt="Steam Capsule" class="h-48 object-contain md:h-56" />
	</div>
</section>

<style>
	.logo-bob {
		animation: bob 2s ease-in-out infinite;
		transform-origin: center;
	}

	@keyframes bob {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
		100% {
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-bob {
			animation: none;
		}
	}
</style>
