<script lang="ts">
	import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
	import { onMount } from 'svelte';

	let component: any;

	onMount(() => {
		const osmd = new OpenSheetMusicDisplay(component);
		osmd.setOptions({
			backend: 'svg',
			drawTitle: true
		});
		const loadPromise = osmd.load('Gym.mxl');

		loadPromise.then(() => {
			osmd.render();
		});
		console.log('osmd 🤡');
	});
</script>

<div bind:this={component} id="osmdContainer" class="max-w-[80%]" />
