<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import "./layout.css";

	let { children } = $props();

	let interactionArrow: HTMLElement;

	function handleMouseMove(e: MouseEvent) {
		const target = e.target as HTMLElement;

		interactionArrow.style.top = `${e.clientY - interactionArrow.clientHeight - 15}px`;
		interactionArrow.style.left = `${e.clientX - interactionArrow.clientWidth / 2}px`;
		interactionArrow.style.opacity = target.closest(".interaction-arrow") ? "1" : "0";
	}

	afterNavigate(() => {
		interactionArrow.style.opacity = "0";
	});
</script>

<svelte:document onmousemove={handleMouseMove} />

<svelte:head>
	<title>Braidle</title>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<div class="mx-auto flex h-full w-100 flex-col gap-5 py-5">
	<div class="text-center">
		<a href="/" class="group interaction-arrow cursor-pointer">
			<h1 class="transition-transform group-hover:scale-105">Braidle</h1>
		</a>
		<h3>Test your Braid knowledge</h3>
	</div>
	{@render children()}
</div>

<div class="absolute bottom-0 left-0 h-42.25 w-full bg-[url(/images/grass.png)] bg-contain bg-center bg-repeat-x pt-2">
	<div class="mx-auto flex h-full w-100 flex-col items-center justify-evenly text-center [&_span]:text-shadow-black [&_span]:text-shadow-md!">
		<span>Braidle by <a href="https://squidee.dev/" target="_blank" class="link">squidee</a></span>
		<div class="flex flex-col">
			<span>Unaffiliated with the creators of Braid</span>
			<span>Game assets &copy; Number One</span>
			<span>Karmina typeface &copy; José Scaglione and Veronika Burian</span>
		</div>
	</div>
</div>

<img bind:this={interactionArrow} src="/images/interaction_arrow.png" alt="" class="pointer-events-none fixed z-100 w-12 opacity-0 transition-opacity select-none" />
