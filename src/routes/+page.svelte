<script lang="ts">
	import { onMount } from 'svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';

	let midiAccess: any;
	let midiDevices: any;
	let selectedInputDevice: any;
	let toggleMIDI = false;

	onMount(async () => {
		// Check if Web MIDI API is available
		if (navigator.requestMIDIAccess) {
			// Request access to MIDI devices
			midiAccess = await navigator.requestMIDIAccess();

			// Get all MIDI input devices
			midiDevices = Array.from(midiAccess.inputs.values());
		}
	});

	function handleDeviceSelection(inputDevice: any) {
		// Select MIDI input device
		selectedInputDevice = inputDevice;
		//selectedInputDevice.onmidimessage = onMIDIMessage; // Listen for MIDI messages
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
			console.log('onMIDIMessage', event.data);
		}
	}

	function getKeyFromNoteNumber(noteNumber: number) {
		//TODO - get key from note number and paint it
	}

	$: if (toggleMIDI) {
		console.log('toggleMIDI', toggleMIDI);
		selectedInputDevice.onmidimessage = onMIDIMessage; // Listen for MIDI messages
	} else {
		selectedInputDevice && (selectedInputDevice.onmidimessage = null);
	}
</script>

{#if midiDevices && !selectedInputDevice}
	<h2>Select MIDI input device:</h2>
	<ul>
		{#each midiDevices as inputDevice}
			<li>
				<button class="btn" on:click={() => handleDeviceSelection(inputDevice)}>
					{inputDevice.name}
				</button>
			</li>
		{/each}
	</ul>
{/if}

{#if selectedInputDevice}
	<h2>Selected MIDI input device:</h2>
	<p>{selectedInputDevice.name}</p>
	<SlideToggle name="toggle-MIDI" bind:checked={toggleMIDI}>Listen Midi Inputs</SlideToggle>
{/if}
