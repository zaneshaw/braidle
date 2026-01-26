<script lang="ts">
	type Props = {
		children: any;
		afterOpen?: () => void;
		beforeClose?: () => void;
		minimal?: boolean;
		duckable?: boolean;
		class?: string;
	};

	let { children, afterOpen = () => {}, beforeClose = () => {}, minimal = false, duckable = false, class: _class = "" }: Props = $props();

	let dialog: HTMLDialogElement;
	// svelte-ignore non_reactive_update
	let container: HTMLElement;

	let duck = $state(false);

	export function open() {
		dialog.show();
		afterOpen();
	}

	export function close() {
		if (!minimal) container.scrollTo(0, 0);
		beforeClose();
		dialog.close();
	}

	function handleMouseMove(e: MouseEvent) {
		const target = e.target as HTMLElement;

		if (duckable) {
			duck = dialog.open && target == dialog;
		}
	}
</script>

<svelte:document onmousemove={handleMouseMove} />

<dialog
	bind:this={dialog}
	onclick={(e) => {
		if (e.target == e.currentTarget) close();
	}}
	closedby="closerequest"
	class:duck
	class="fixed top-0 left-0 z-50 size-full items-center justify-center border-0 bg-black/50 outline-none *:opacity-100 *:transition-[opacity,filter] open:flex [.duck]:*:opacity-35 [.duck]:*:blur"
>
	{#if minimal}
		{@render children?.()}
	{:else}
		<div bind:this={container} class="bg-box w-max flex-col gap-2 overflow-y-auto {_class}">
			{@render children?.()}
		</div>
	{/if}
</dialog>
