<script lang="ts">
	import { LINKS } from '$lib/config/links';

	const footerLinks = [
		{ href: LINKS.vpetlings.steam, label: 'Steam', hoverColor: '#6b7280' },
		{ href: LINKS.vpetlings.twitter, label: 'Twitter', hoverColor: '#22d3ee' },
		{ href: LINKS.vpetlings.instagram, label: 'Instagram', hoverColor: '#f472b6' },
		{ href: LINKS.vpetlings.reddit, label: 'Reddit', hoverColor: '#fb923c' }
	];
</script>

<footer class="footer-dither w-full text-whitish">
	<div class="mx-auto max-w-5xl p-2">
		<div class="flex flex-col items-center gap-0.5 text-center">
			<p>
				SargantanaGames © {new Date().getFullYear()}
			</p>

			<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 sm:gap-x-12">
				{#each footerLinks as link (link.href)}
					<a
						href={link.href}
						target="_blank"
						rel="external noopener noreferrer"
						class="social-link opacity-80 transition-all ease-out"
						style={`--hover-color: ${link.hoverColor}`}
					>
						{link.label}
					</a>
				{/each}
			</div>

			<a
				href="mailto:contact@sargantanagames.com"
				class="
            opacity-80 transition-all ease-out
            hover:text-red-400 hover:opacity-100
          "
			>
				contact@sargantanagames.com
			</a>
		</div>
	</div>
</footer>

<style>
	.footer-dither {
		position: relative;
		background: var(--color-secondary);
	}

	.footer-dither::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -12px;
		height: 12px;

		background-image: url('/src/lib/assets/dither-checker-footer.svg');
		background-repeat: repeat-x;
		background-size: 8px 12px;

		pointer-events: none;
	}

	.social-link:hover {
		color: var(--hover-color);
		opacity: 1;
	}
</style>
