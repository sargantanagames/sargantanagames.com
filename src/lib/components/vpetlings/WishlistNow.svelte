<script>
	import { LINKS } from '$lib/config/links';
	import SteamIcon from '$lib/components/SteamIcon.svelte';
</script>

<a
	href={LINKS.vpetlings.steam}
	target="_blank"
	rel="external noopener noreferrer"
	class="
            inline-flex items-center gap-2 rounded
            bg-gradient-to-r from-[#6b8f1a] to-[#4f6b0f]
            px-4 py-2 text-sm font-light text-[#d2efa9]
            transition ease-out
            hover:from-[#7fa61e] hover:to-[#5c7e10]
          "
>
	<SteamIcon classes="h-5" fill="white" />
	<span class="font-[Brisa_Sans]">Add to your wishlist</span>
</a>
