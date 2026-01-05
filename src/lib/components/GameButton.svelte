<script lang="ts">
	let { href, iconSrc, label, description }: { href: string; iconSrc: string; label: string; description: string } = $props();
</script>

<a {href} class="group interaction-arrow flex cursor-pointer gap-4 bg-[url(/images/pipe.png)] bg-contain bg-center bg-no-repeat px-5 py-2">
	<img src={iconSrc} alt="Game icon" class="h-16" />
	<div class="flex grow flex-col justify-center text-left">
		<h2 class="mt-1 leading-6 group-hover:animate-[flash-red_0.6s_infinite_linear_alternate]">{label}</h2>
		<span>{description}</span>
	</div>
</a>
