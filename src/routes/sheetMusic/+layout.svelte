<script lang="ts">
	import { page } from '$app/stores';
</script>

<slot />
<h1>{$page.data.hi}</h1>
{#if $page.data.component}
	<svelte:component this={$page.data.component} />
{/if}
