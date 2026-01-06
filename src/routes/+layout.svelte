<script lang="ts">
	import "./layout.css";

	let { children } = $props();

	let interactionArrow: HTMLElement;

	function handleMouseMove(e: MouseEvent) {
		const target = e.target as HTMLElement;

		interactionArrow.style.top = `${e.clientY - interactionArrow.clientHeight - 5}px`;
		interactionArrow.style.left = `${e.clientX - interactionArrow.clientWidth / 2}px`;
		interactionArrow.style.opacity = target.closest(".interaction-arrow") ? "1" : "0";
	}
</script>

<svelte:document onmousemove={handleMouseMove} />

<svelte:head>
	<title>Braidle</title>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<div class="mx-auto flex h-full w-100 flex-col gap-5 py-5">
	<div class="text-center">
		<a href="/" class="cursor-pointer"><h1>Braidle</h1></a>
		<h3>Test your Braid knowledge</h3>
	</div>
	{@render children()}
</div>

<img bind:this={interactionArrow} src="/images/temp_arrow.png" alt="" class="pointer-events-none fixed z-100" />
