<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import idleGif from '$lib/assets/vpetlings/vpet-idle.gif';
	import walkGif from '$lib/assets/vpetlings/vpet-walk.gif';
	import petGif from '$lib/assets/vpetlings/vpet-pet.gif';

	const {
		featureImage
	}: {
		featureImage: HTMLImageElement | null;
	} = $props();

	const BASE_SPEED = 0.00022;
	const IDLE_DURATION = 1000;
	const IDLE_LOOPS = 3;

	const SPAWN_X = 0.09;
	const SPAWN_Y = 0.48;

	let container: HTMLDivElement | null = null;
	let raf: number;

	let x = $state(-10000);
	let y = $state(-10000);
	let targetX = $state(0);
	let targetY = $state(0);

	let petState = $state<'idle' | 'walk' | 'petting'>('idle');
	let idleElapsed = $state(0);

	let mouseX = $state(0);
	let mouseY = $state(0);
	let lastMouseX = 0;
	let lastMouseY = 0;
	let mouseTravel = $state(0);
	let lastScrollY = 0;
	let scrollTravel = $state(0);

	let lastTime = 0;
	let facing = $state<'left' | 'right'>('left');

	let isActive = $state(false);
	let firstActivation = true;
	let hasMousePosition = $state(false);
	let isFullyVisible = false;
	let isRevealComplete = false;

	let imageWidth = $state(0);
	let petTimeout: ReturnType<typeof setTimeout> | null = null;

	const petSize = $derived(imageWidth > 0 ? imageWidth * 0.17 : 144);

	const PET_PET_DURATION = 1600;
	const DEFAULT_ARRIVAL_THRESHOLD = 10;
	const SMOOTHING = 0.2;
	const ACTIVATION_VISIBILITY_RATIO = 0.98;

	let currentDirection = { x: 0, y: 0 };
	let currentArrivalThreshold = DEFAULT_ARRIVAL_THRESHOLD;
	let resizeObserver: ResizeObserver | null = null;
	let revealObserver: MutationObserver | null = null;

	function handleClick(e: MouseEvent): void {
		void e;
		petState = 'petting';
		idleElapsed = 0;

		if (petTimeout) {
			clearTimeout(petTimeout);
		}

		petTimeout = setTimeout(() => {
			petState = 'idle';
			petTimeout = null;
		}, PET_PET_DURATION);
	}

	function handleMouseMove(e: MouseEvent): void {
		hasMousePosition = true;
		activatePet();

		if (lastMouseX !== 0 || lastMouseY !== 0) {
			mouseTravel += Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
		}

		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
		mouseX = e.clientX;
		mouseY = e.clientY;

		maybeReactToActivity();
	}

	function handleScroll(): void {
		const currentScrollY = window.scrollY;
		scrollTravel += Math.abs(currentScrollY - lastScrollY);
		lastScrollY = currentScrollY;

		if (!isActive) return;

		idleElapsed = 0;

		maybeReactToActivity();
	}

	function maybeReactToActivity(): void {
		if (!isActive) return;

		if (mouseTravel + scrollTravel < petSize * 3) return;

		mouseTravel = 0;
		scrollTravel = 0;
		idleElapsed = 0;

		if (!isMouseNear()) {
			pickTarget();
		}
	}

	function spawnFromImage(nx: number, ny: number): void {
		if (!featureImage || !container) return;

		const imageRect = featureImage.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		imageWidth = imageRect.width;

		x = imageRect.left + imageRect.width * nx - containerRect.left;
		y = imageRect.top + imageRect.height * ny - containerRect.top;

		targetX = x;
		targetY = y;

		mouseTravel = 0;
		scrollTravel = 0;
		lastMouseX = 0;
		lastMouseY = 0;
	}

	function isMouseNear(): boolean {
		if (!container) return false;

		const rect = container.getBoundingClientRect();
		const petScreenX = rect.left + x;
		const petScreenY = rect.top + y;

		return Math.hypot(mouseX - petScreenX, mouseY - petScreenY) < petSize * 3;
	}

	function pickTarget(): void {
		if (!container || petState === 'petting') return;

		const rect = container.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			petState = 'idle';
			return;
		}

		const minX = petSize / 2;
		const minY = petSize / 2;
		const maxX = rect.width - petSize / 2;
		const maxY = rect.height - petSize / 2;

		const originX = mouseX || rect.left + rect.width / 2;
		const originY = mouseY || rect.top + rect.height / 2;

		const angle = Math.random() * Math.PI * 2;
		const distance = petSize;

		let tx = originX + Math.cos(angle) * distance - rect.left;
		let ty = originY + Math.sin(angle) * distance - rect.top;

		tx = Math.min(maxX, Math.max(minX, tx));
		ty = Math.min(maxY, Math.max(minY, ty));

		setTarget(tx, ty);
		petState = 'walk';
	}

	function setTarget(tx: number, ty: number, arrivalOverride: number = -1) {
		targetX = tx;
		targetY = ty;
		currentArrivalThreshold = arrivalOverride >= 0 ? arrivalOverride : DEFAULT_ARRIVAL_THRESHOLD;
		if (Math.hypot(currentDirection.x, currentDirection.y) < 0.001) {
			const dx = targetX - x;
			const dy = targetY - y;
			const d = Math.hypot(dx, dy) || 1;
			currentDirection.x = dx / d;
			currentDirection.y = dy / d;
		}
	}

	function loop(time: number): void {
		raf = requestAnimationFrame(loop);
		if (!isActive || !container) return;

		const dt = time - lastTime;
		lastTime = time;

		if (petState === 'idle') {
			if (!firstActivation && isMouseNear()) {
				idleElapsed = 0;
			} else {
				idleElapsed += dt;

				const effectiveIdle = IDLE_DURATION * (firstActivation ? 0 : IDLE_LOOPS);

				if (idleElapsed >= effectiveIdle) {
					idleElapsed = 0;
					firstActivation = false;
					if (!isMouseNear()) {
						pickTarget();
					}
				}
			}
		}

		if (petState === 'walk') {
			const dx = targetX - x;
			const dy = targetY - y;
			const dist = Math.hypot(dx, dy);

			let desiredX = 0;
			let desiredY = 0;
			if (dist > 0.0001) {
				desiredX = dx / dist;
				desiredY = dy / dist;
			}

			currentDirection.x += (desiredX - currentDirection.x) * SMOOTHING;
			currentDirection.y += (desiredY - currentDirection.y) * SMOOTHING;

			const cdLen = Math.hypot(currentDirection.x, currentDirection.y) || 1;
			currentDirection.x /= cdLen;
			currentDirection.y /= cdLen;

			if (Math.abs(currentDirection.x) >= 0.01) {
				facing = currentDirection.x < 0 ? 'left' : 'right';
			}

			const rect = container.getBoundingClientRect();
			const speed = BASE_SPEED * Math.min(rect.width, rect.height);

			x += currentDirection.x * speed * dt;
			y += currentDirection.y * speed * dt;

			if (Math.hypot(targetX - x, targetY - y) < currentArrivalThreshold) {
				x = targetX;
				y = targetY;
				petState = 'idle';
				idleElapsed = 0;
				currentDirection.x = 0;
				currentDirection.y = 0;
			} else {
				enforceBounds();
			}
		}
	}

	function enforceBounds(): void {
		if (!container) return;

		const rect = container.getBoundingClientRect();

		const minX = 0;
		const minY = 0;
		const maxX = rect.width;
		const maxY = rect.height;

		let teleported = false;

		if (x < minX) {
			x = minX;
			teleported = true;
		} else if (x > maxX) {
			x = maxX;
			teleported = true;
		}

		if (y < minY) {
			y = minY;
			teleported = true;
		} else if (y > maxY) {
			y = maxY;
			teleported = true;
		}

		if (teleported) {
			currentDirection.x = 0;
			currentDirection.y = 0;
		}
	}

	function updateContainerHeight(): void {
		if (!container || !isActive) return;
		container.style.height = `${document.body.scrollHeight}px`;
	}

	function handleResize(): void {
		updateContainerHeight();
		if (featureImage) {
			spawnFromImage(SPAWN_X, SPAWN_Y);
		}
	}

	function reparentToWorld(): void {
		if (!container) return;
		const world = container.parentElement?.parentElement;
		if (world) world.appendChild(container);
	}

	function activatePet(): void {
		if (isActive || !hasMousePosition || !isFullyVisible || !isRevealComplete) return;

		isActive = true;
		lastTime = performance.now();
		reparentToWorld();
		spawnFromImage(SPAWN_X, SPAWN_Y);
		updateContainerHeight();
	}

	function trackRevealCompletion(revealEl: HTMLElement): void {
		if (!revealEl.classList.contains('is-visible')) return;

		const animations = revealEl
			.getAnimations()
			.filter((animation) => animation.playState !== 'finished');

		if (animations.length === 0) {
			isRevealComplete = true;
			activatePet();
			return;
		}

		void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
			isRevealComplete = true;
			activatePet();
		});
	}

	onMount(() => {
		lastScrollY = window.scrollY;

		for (const src of [idleGif, walkGif, petGif]) {
			const image = new Image();
			image.src = src;
			void image.decode?.().catch(() => {});
		}

		const waitForAnchor = () => {
			if (container && featureImage) {
				spawnFromImage(SPAWN_X, SPAWN_Y);

				const revealEl = featureImage.closest('.reveal') as HTMLElement | null;

				if (revealEl) {
					trackRevealCompletion(revealEl);
					revealObserver = new MutationObserver(() => {
						trackRevealCompletion(revealEl);
					});
					revealObserver.observe(revealEl, {
						attributes: true,
						attributeFilter: ['class']
					});
				}

				const observer = new IntersectionObserver(
					([entry]) => {
						isFullyVisible = entry.intersectionRatio >= ACTIVATION_VISIBILITY_RATIO;

						if (isFullyVisible) {
							activatePet();
						}
					},
					{ threshold: [ACTIVATION_VISIBILITY_RATIO] }
				);

				observer.observe(featureImage);
				resizeObserver = new ResizeObserver(() => {
					spawnFromImage(SPAWN_X, SPAWN_Y);
					updateContainerHeight();
				});
				resizeObserver.observe(featureImage);
				window.addEventListener('pointermove', handleMouseMove);
				window.addEventListener('scroll', handleScroll, { passive: true });
				window.addEventListener('resize', handleResize);

				raf = requestAnimationFrame(loop);
				return;
			}

			requestAnimationFrame(waitForAnchor);
		};

		waitForAnchor();
	});

	onDestroy(() => {
		if (container && container.parentNode) {
			container.parentNode.removeChild(container);
		}

		if (typeof window !== 'undefined') {
			window.cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', handleMouseMove);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		}

		resizeObserver?.disconnect();
		revealObserver?.disconnect();

		if (petTimeout) {
			clearTimeout(petTimeout);
		}
	});
</script>

<div bind:this={container} class="pointer-events-none absolute top-0 left-0 z-50 w-full">
	<button
		type="button"
		aria-label="Pet the virtual pet"
		class="pointer-events-auto absolute block cursor-pointer appearance-none overflow-visible border-0 bg-transparent p-0 leading-none select-none"
		onclick={handleClick}
		style="
			width: {petSize}px;
			height: {petSize}px;
			transform:
				translate({x}px, {y}px)
				translate(-50%, -50%)
				scaleX({facing === 'left' ? -1 : 1});
		"
	>
		<img
			src={petState === 'petting' ? petGif : petState === 'idle' ? idleGif : walkGif}
			alt=""
			class="block h-full w-full"
			draggable="false"
		/>
	</button>
</div>
