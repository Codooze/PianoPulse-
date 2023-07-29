<script lang="ts">
	import MidiPlayer from '../components/MidiPlayer.svelte';

	let testMidi = false;
</script>

{#if testMidi}
	<MidiPlayer />
{:else}
	<p>Test your midi</p>
{/if}
<button class="btn variant-filled-primary" on:click={() => (testMidi = !testMidi)}>
	{!testMidi ? 'Show MidiPlayer' : 'Hide MidiPlayer'}
</button>
