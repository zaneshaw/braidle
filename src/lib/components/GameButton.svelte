<script lang="ts">
	import { GameMode } from "$lib/types";

	interface Props {
		href: string;
		iconSrc: string;
		label: string;
		description: string;
		mode?: GameMode;
		disabled?: boolean;
	}

	let { href, iconSrc, label, description, mode, disabled = false }: Props = $props();
</script>

<a
	href={mode == undefined ? href : `/${mode}${href}`}
	class:disabled
	class="group interaction-arrow flex h-20 cursor-pointer items-center gap-4 bg-[url(/images/pipe.png)] bg-contain bg-center bg-no-repeat px-9 py-2 [.disabled]:pointer-events-none [.disabled]:opacity-50"
>
	<img src={iconSrc} alt="Game icon" class="icon-outline size-12" />
	<div class="flex grow flex-col justify-center text-left">
		<h2 class="mt-1 leading-6 group-hover:animate-[flash-red_0.6s_infinite_linear_alternate]">{label}</h2>
		<span>{description}</span>
	</div>
</a>
