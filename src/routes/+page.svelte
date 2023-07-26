<script lang="ts">
	import { onMount } from 'svelte';
	import { Midi } from '@tonejs/midi';
	// Mental note: I might need to use https://www.npmjs.com/package/tone?activeTab=dependencies later on

	let midiAccess: any;
	let outputDevices: any;
	let selectedOutputDevice: any;
	let midiFile: any;
	let isPlaying: boolean = false;
	let isLoading: boolean = false;

	onMount(async () => {
		// Check if Web MIDI API is available
		if (navigator.requestMIDIAccess) {
			// Request access to MIDI devices
			midiAccess = await navigator.requestMIDIAccess();

			// Get all MIDI output devices
			outputDevices = Array.from(midiAccess.outputs.values());
		}
	});

	async function handleFileInput(event: any) {
		// Load MIDI file
		console.log('File input event:', event);
		console.log('File input files:', event.target.files);
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = async (event: any) => {
			const buffer = event.target.result;
			console.log('MIDI file buffer:', buffer);

			// Parse MIDI file using @tonejs/midi
			try {
				console.log('Parsing MIDI file using @tonejs/midi...');
				isLoading = true;

				const midi = new Midi(buffer);
				const tracks = midi.tracks.map((track) =>
					track.notes.map((note) => ({
						time: note.time,
						duration: note.duration,
						name: note.name,
						midi: note.midi,
						velocity: note.velocity
					}))
				);

				console.log('Parsed MIDI file using @tonejs/midi:', tracks);
			} catch (error) {
				console.error('Error parsing MIDI file using @tonejs/midi:', error);
			} finally {
				isLoading = false;
			}
		};
		reader.readAsArrayBuffer(file);
	}

	function handleDeviceSelection(outputDevice: any) {
		// Select MIDI output device
		selectedOutputDevice = outputDevice;
		console.log('Selected output device:', selectedOutputDevice.name);
	}

	async function playMidiFile() {
		if (!isPlaying && midiFile) {
			isPlaying = true;
			const track = midiFile.tracks[0];
			const startTime = performance.now();
			let lastEventTime = 0;
			for (const event of track) {
				const deltaTime = event.deltaTime;
				await new Promise((resolve) => setTimeout(resolve, deltaTime));
				lastEventTime += deltaTime;
				if (event.type === 'channel') {
					selectedOutputDevice.send(event.data);
				}
			}
			isPlaying = false;
		}
	}
</script>

<h1>Select MIDI output device:</h1>
{#if outputDevices}
	<ul>
		{#each outputDevices as outputDevice}
			<li>
				<button class="btn" on:click={() => handleDeviceSelection(outputDevice)}>
					{outputDevice.name}
				</button>
			</li>
		{/each}
	</ul>
{/if}

<h1>Select MIDI file:</h1>
<input type="file" accept=".mid" on:change={handleFileInput} />

{#if isLoading}
	<p>Loading MIDI file...</p>
{:else if !midiFile}
	<p>No MIDI file selected.</p>
{:else}
	<button class="btn" on:click={playMidiFile} disabled={isPlaying}>
		{#if isPlaying}
			Playing MIDI file...
		{:else}
			Play MIDI file
		{/if}
	</button>
{/if}
