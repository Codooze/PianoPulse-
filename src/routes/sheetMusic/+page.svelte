<script lang="ts">
	import { scoreAction } from './scoreAction';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import JSZip from 'jszip';

	let musicXML: string = '';
	let running = false;
	let file = null;
	async function onChangeHandler(e: Event): Promise<void> {
		const files = (e.target as HTMLInputElement).files;

		if (files && files.length > 0) {
			const file = files[0];

			if (file.type === 'application/vnd.recordare.musicxml') {
				console.log('PARSING MUSICXML FILE ..🚀🚀🚀');

				const arrayBuffer = await file.arrayBuffer();
				// If the file is a compressed MusicXML file, extract the MusicXML file using JSZip
				const zip = await JSZip.loadAsync(arrayBuffer);
				const musicXMLFile = zip.file(/\.xml$/i)[1]; // Get the second file with the .xml extension
				console.log('musicXMLFile:', musicXMLFile);
				const musicXMLContent = await musicXMLFile.async('text');
				musicXML = musicXMLContent;
			} else {
				const fileURL = URL.createObjectURL(file);
				musicXML = fileURL;
			}
		}
		running = true;
	}
</script>

<FileDropzone name="files" on:change={onChangeHandler} />

<div use:scoreAction={{ xml: musicXML, running }} />
