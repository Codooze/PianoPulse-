<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Midi } from '@tonejs/midi';

	let midiAccess: any;
	let midiDevices: any;
	let selectedOutputDevice = writable();
	let tracks = writable([]);
	let isPlaying: boolean = false;
	let isLoading: boolean = false;

	onMount(async () => {
		// Check if Web MIDI API is available
		if (navigator.requestMIDIAccess) {
			// Request access to MIDI devices
			midiAccess = await navigator.requestMIDIAccess();

			// Get all MIDI output devices
			midiDevices = Array.from(midiAccess.outputs.values());
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
				const parsedTracks = midi.tracks.map((track) =>
					track.notes.map((note) => ({
						time: note.time,
						duration: note.duration,
						name: note.name,
						midi: note.midi,
						velocity: note.velocity
					}))
				);

				console.log('Parsed MIDI file using @tonejs/midi:', parsedTracks);

				// Set parsed MIDI file tracks to tracks store
				tracks.set(parsedTracks);
			} catch (error) {
				console.error('Error parsing MIDI file using @tonejs/midi:', error);
			} finally {
				isLoading = false;
			}
		};
		reader.readAsArrayBuffer(file);
	}

	function handleDeviceOutput(outputDevice: any) {
		// Select MIDI output device
		$selectedOutputDevice = outputDevice;
		console.log('Selected output device:', $selectedOutputDevice.name);
	}

	async function playMidiFile() {
		console.log('playMidiFile called');
		console.log('isPlaying:', isPlaying);
		console.log('selectedOutputDevice:', $selectedOutputDevice);
		console.log('tracks:', $tracks);

		if (!isPlaying && $tracks.length > 0 && $selectedOutputDevice) {
			isPlaying = true;
			const track = $tracks[0];
			const startTime = performance.now();
			let lastEventTime = 0;
			for (const event of track) {
				console.log('event:', event);
				console.log('event.time:', event.time);
				console.log('event.data:', event.data); //! event data is undefined that is why it is not playing (?)

				const deltaTime = event.deltaTime;
				await new Promise((resolve) => setTimeout(resolve, deltaTime));
				lastEventTime += deltaTime;
				if (event.type === 'channel') {
					$selectedOutputDevice.send(event.data);
				}
			}
			isPlaying = false;
		}
	}
</script>

<h2>Select MIDI file:</h2>
<input type="file" accept=".mid" on:change={handleFileInput} />

{#if isLoading}
	<p>Loading MIDI file...</p>
{:else if !$tracks.length}
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

<h2>Select MIDI output device:</h2>
{#if midiDevices}
	<ul>
		{#each midiDevices as outputDevice}
			<li>
				<button class="btn" on:click={() => handleDeviceOutput(outputDevice)}>
					{outputDevice.name}
				</button>
			</li>
		{/each}
	</ul>
{/if}
