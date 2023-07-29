<script lang="ts">
	import { Midi } from '@tonejs/midi';
	import * as Tone from 'tone';

	export let data: any = {};
	let midi: any;
	let currentMidi: any;

	const playMidiFile = () => {
		// play the currentMidi using Tone.js
		const now = Tone.now() + 0.5; // delay start by a half second

		currentMidi.tracks.forEach((track: any) => {
			track.notes.forEach((note: any) => {
				const synth = new Tone.Synth().toDestination();
				synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
			});
		});
	};

	const handleMidiFile = async (event: any) => {
		const file = event.target.files[0];

		function parseFile(file: any) {
			//read the file
			const reader = new FileReader();
			reader.onload = function (e) {
				if (e.target?.result instanceof ArrayBuffer) {
					const midi = new Midi(e.target.result);
					currentMidi = midi;
					console.log('midi', midi);
				} else {
					console.log('Error: file is not an ArrayBuffer');
				}
			};
			reader.readAsArrayBuffer(file);
		}
		parseFile(file);
	};
</script>

<form method="POST" enctype="multipart/form-data">
	<label>
		Add MIDI file:
		<input
			on:change={handleMidiFile}
			type="file"
			name="midiFile"
			id="file"
			accept=".mid,.midi,.xml"
		/>
	</label>
	<button class="btn variant-filled-primary" type="submit">Send</button>
</form>

<audio id="audioPlayer" />

<button class="btn variant-filled-primary" on:click={playMidiFile}>Play</button>
