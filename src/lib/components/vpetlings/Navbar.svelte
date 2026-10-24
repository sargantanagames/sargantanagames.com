<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import vpetlingsLogo from '$lib/assets/vpetlings/vpetlings-logo-raw.webp';
	import SteamIcon from '$lib/components/SteamIcon.svelte';
	import { LINKS } from '$lib/config/links';

	let mobileOpen = false;

	const navLinks = [
		{ href: '/vpetlings', label: 'Home' },
		{ href: '/vpetlings/about-us', label: 'About Us' }
	] as const;
</script>

<header class="header-dither w-full bg-accent-dark text-whitish">
	<nav class="mx-auto flex max-w-5xl items-center px-2 py-1">
		<!-- Logo -->
		<a href={resolve('/vpetlings')} class="flex items-center">
			<img
				src={vpetlingsLogo}
				alt="VPetlings Logo"
				class="m-1 h-10 object-contain transition-transform ease-out hover:scale-105"
			/>
		</a>

		<div class="flex-1"></div>

		<!-- Desktop navigation -->
		<div class="hidden items-center gap-6 text-2xl md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={resolve(link.href)}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
					class="underline-center opacity-90 transition-opacity ease-out hover:opacity-100 aria-[current=page]:opacity-100"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Desktop Steam button -->
		<a
			href={LINKS.vpetlings.steam}
			target="_blank"
			rel="external noopener noreferrer"
			class="
        ml-6 hidden items-center gap-2 rounded
        bg-gradient-to-r from-[#6b8f1a] to-[#4f6b0f]
        px-4 py-1 text-sm font-light text-[#d2efa9]
        transition ease-out
        hover:from-[#7fa61e] hover:to-[#5c7e10]
        md:inline-flex
      "
		>
			<SteamIcon classes="h-5" fill="white" />
			<span class="font-[Brisa_Sans]">Add to your wishlist</span>
		</a>

		<!-- Mobile hamburger -->
		<button
			class="ml-2 flex cursor-pointer items-center opacity-90 transition-opacity hover:opacity-100 md:hidden"
			aria-label="Toggle menu"
			onclick={() => (mobileOpen = !mobileOpen)}
		>
			<svg class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</nav>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="bg-accent-dark px-4 pb-4 text-center md:hidden">
			<div class="flex flex-col gap-4 text-xl">
				{#each navLinks as link (link.href)}
					<a
						href={resolve(link.href)}
						aria-current={page.url.pathname === link.href ? 'page' : undefined}
						class="opacity-90 transition-opacity ease-out hover:opacity-100 aria-[current=page]:opacity-100"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}

				<div>
					<a
						href={LINKS.vpetlings.steam}
						target="_blank"
						rel="external noopener noreferrer"
						class="
            mt-2 inline-flex items-center gap-2 rounded
            bg-gradient-to-r from-[#6b8f1a] to-[#4f6b0f]
            px-4 py-2 text-sm font-light text-[#d2efa9]
            transition ease-out
            hover:from-[#7fa61e] hover:to-[#5c7e10]
          "
					>
						<SteamIcon classes="h-5" fill="white" />
						<span class="font-[Brisa_Sans]">Add to your wishlist</span>
					</a>
				</div>
			</div>
		</div>
	{/if}
</header>

<style>
	.header-dither {
		position: relative;
	}

	.header-dither::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -16px;
		height: 16px;

		background-image: url('/src/lib/assets/dither-checker-navbar.svg');
		background-repeat: repeat-x;
		background-size: 8px 12px;

		pointer-events: none;
	}
</style>
