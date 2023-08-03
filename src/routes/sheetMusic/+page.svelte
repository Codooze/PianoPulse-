<script lang="ts">
	import { scoreAction } from './scoreAction';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import JSZip from 'jszip';
	import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

	let selectedFile = false;
	let musicXML: string = '';
	let node = null;
	let running = false;
	let sheet: any = null;
	//TODO Get the div HTML element to post the score to the database when I click on the button
	let file = null;
	async function onChangeHandler(e: Event): Promise<void> {
		/////////////////
		const fileURL2 = 'Gym.mxl';

		const response = await fetch(fileURL2);
		//TODO I could do this then get the score.xml I also could add a check to see if the file is a zip or not if it is run this logic
		const arrayBuffer = await response.arrayBuffer();
		const zip = await JSZip.loadAsync(arrayBuffer);
		console.log('arrayBuffer', arrayBuffer.files);

		console.log('zip:', zip);

		/////////////////

		selectedFile = true;
		console.log('TARGET .🔥', e.target.files);
		const newFile = e.target.files[0];
		const createUrl = URL.createObjectURL(newFile);
		console.log('File TYpe', newFile.type);

		const files = (e.target as HTMLInputElement).files;
		console.log('files:', files);

		if (files && files.length > 0) {
			const file = files[0];

			if (file.type === 'application/vnd.recordare.musicxml') {
				console.log('PARSING MUSICXML FILE ..🚀🚀🚀');

				const arrayBuffer = await file.arrayBuffer();
				// If the file is a compressed MusicXML file, extract the MusicXML file using JSZip
				const zip = await JSZip.loadAsync(arrayBuffer);
				const musicXMLFile = zip.file(/\.xml$/i)[1]; // Get the first file with the .xml extension
				console.log('musicXMLFile:', musicXMLFile);
				const musicXMLContent = await musicXMLFile.async('text');
				musicXML = musicXMLContent;
			} else {
				// If the file is not a MusicXML file, display an error message
				alert('Invalid file type. Please select a MusicXML file.');
				return;
			}
		}

		// if (files && files.length > 0) {
		// 	const file = files[0];
		// 	const fileURL = URL.createObjectURL(file);
		// 	console.log('file type:', file.type);
		// 	const response = await fetch(fileURL);
		// 	console.log('response:', response);
		// 	const anotherURL = await response.blob();
		// 	const url = URL.createObjectURL(anotherURL);
		// 	console.log('anotherURL:', anotherURL);

		// 	musicXML = fileURL;
		// }
		running = true;
		console.log(sheet);

		node = document.getElementById('node');
		const osmd = new OpenSheetMusicDisplay(node);
		osmd.setOptions({
			backend: 'svg',
			drawTitle: true
		});

		const loadPromise = osmd.load(sheet);

		loadPromise.then(() => {
			osmd.render();
			console.log('render from sheetMusic ❤️:', osmd);
		});
	}
</script>

<p>HOasdadasdasdasdla mama</p>
<FileDropzone name="files" on:change={onChangeHandler} />

<input type="file" bind:value={sheet} on:change={onChangeHandler} />

<!-- <div use:scoreAction={{ xml: musicXML, running }} /> -->
<div id="node" />
{#if selectedFile && musicXML}
	<h2>❤️</h2>
{/if}
