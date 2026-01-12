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

<img bind:this={interactionArrow} src="/images/interaction_arrow.png" alt="" class="pointer-events-none fixed z-100 w-12 opacity-0 transition-opacity" />
