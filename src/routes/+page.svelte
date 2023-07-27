<script lang="ts">
	import { onMount } from 'svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	let midiAccess: any;
	let midiDevices: any;
	let selectedInputDevice: any;
	let toggleMIDI = false;

	let midiOutputDevices: any;
	let selectedOutputDevice: any;
	let tracks: any;
	let isPlaying = false;

	onMount(async () => {
		// Check if Web MIDI API is available
		if (navigator.requestMIDIAccess) {
			// Request access to MIDI devices
			midiAccess = await navigator.requestMIDIAccess();

			// Get all MIDI input devices
			midiDevices = Array.from(midiAccess.inputs.values());

			// Get all MIDI output devices
			midiOutputDevices = Array.from(midiAccess.outputs.values());
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

	//------------------ Play MIDI file logic ------------------//
	let audioContext: any;
	async function handleOutputDeviceSelection(outputDevice: any) {
		// Select MIDI output device
		selectedOutputDevice = outputDevice;
		console.log('Selected output device:', selectedOutputDevice.name);
	}

	let file: any;
	let fileUrl: any;
	async function handleFileSelection(event: any) {
		file = event.target.files;
		console.log('handleFileSelection', file);

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const arrayBuffer = reader.result as ArrayBuffer;
				const blob = new Blob([arrayBuffer], { type: 'audio/midi' });
				fileUrl = URL.createObjectURL(blob);
				console.log('playMidi', fileUrl);
				// isPlaying = true;
				// selectedOutputDevice.play(blob);
			};
			reader.readAsArrayBuffer(file[0]);
		}
	}

	async function playMidi() {}
</script>

{#if midiDevices && !selectedInputDevice}
	<h2>Select MIDI input device:</h2>
	<ul>
		{#each midiDevices as inputDevice}
			<li>
				<button
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					on:click={() => handleDeviceSelection(inputDevice)}
				>
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

{#if midiOutputDevices && !selectedOutputDevice}
	<h2>Select MIDI output device:</h2>
	<ul>
		{#each midiOutputDevices as outputDevice}
			<li>
				<button
					class="btn variant-ghost-primary"
					on:click={() => handleOutputDeviceSelection(outputDevice)}
				>
					{outputDevice.name}
				</button>
			</li>
		{/each}
	</ul>
{/if}

{#if selectedOutputDevice}
	<h2>Selected MIDI output device:</h2>
	<p>{selectedOutputDevice.name}</p>
	<input type="file" accept=".mid" on:change={handleFileSelection} />
	<button class="variant-filled-primary" on:click={playMidi}>Play</button>
{/if}

