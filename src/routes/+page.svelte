<script lang="ts">
	import { onMount } from 'svelte';

	let midiAccess: any;
	let inputDevices: any;
	let selectedInputDevice: any;

	onMount(async () => {
		// Check if Web MIDI API is available
		if (navigator.requestMIDIAccess) {
			// Request access to MIDI devices
			midiAccess = await navigator.requestMIDIAccess();

			// Get all MIDI input devices
			inputDevices = Array.from(midiAccess.inputs.values());
		}
	});

	function handleDeviceSelection(inputDevice: any) {
		// Select MIDI input device
		selectedInputDevice = inputDevice;
		selectedInputDevice.onmidimessage = onMIDIMessage; // Listen for MIDI messages
		console.log('Selected input device:', selectedInputDevice.name);
	}

	let lastNoteTime: number;

	function onMIDIMessage(event: any) {
		const [command, note, velocity] = event.data;

		if (command === 0x90) {
			// This is a note on message, handle it
			const currentTime = performance.now();
			const delay = currentTime - lastNoteTime;
			console.log('Note:', note, 'Velocity:', velocity, 'Delay:', delay);

			lastNoteTime = currentTime;
			getKeyFromNoteNumber(note);
			playNoteOnPiano(note, velocity);
		}
	}

	function getKeyFromNoteNumber(noteNumber: number) {
		//TODO - get key from note number and paint it
	}

	function playNoteOnPiano(key: number, velocity: number) {
		// Play corresponding note on the piano
		// ...
	}
</script>

<h1>Select MIDI input device:</h1>
{#if inputDevices}
	<ul>
		{#each inputDevices as inputDevice}
			<li>
				<button class="btn" on:click={() => handleDeviceSelection(inputDevice)}>
					{inputDevice.name}
				</button>
			</li>
		{/each}
	</ul>
{/if}
