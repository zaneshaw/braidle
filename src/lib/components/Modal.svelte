<script lang="ts">
	let { children } = $props();

	let dialog: HTMLDialogElement;

	export function open() {
		dialog.show();
	}

	export function close() {
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	onclick={(e) => {
		if (e.target == e.currentTarget) close();
	}}
	closedby="closerequest"
	class="fixed top-0 left-0 size-full z-10 items-center justify-center bg-black/50 open:flex"
>
	{@render children()}
</dialog>
