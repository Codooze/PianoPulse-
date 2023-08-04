<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

	let musicXML: any = null;

	async function onChangeHandler(e: DragEvent): Promise<void> {
		const files = (e.target as HTMLInputElement).files;
		const file = files[0];
		console.log('file:', file);
		console.log('files:', files);

		// Create a new FileReader object to read the contents of the file
		const reader = new FileReader();

		// Set up an onload event handler to be called when the file has been read
		reader.onload = function (res) {
			// Set the musicXML variable to the contents of the file
			musicXML = res.target.result;

			// Call the renderScore() function to render the score
			renderScore();
		};
		console.log(file);

		// Read the contents of the file as text
		reader.readAsBinaryString(file);
	}

	function renderScore(): void {
		// Get the HTML element to render the score to
		const node = document.getElementById('node');

		// Create a new OpenSheetMusicDisplay object
		const osmd = new OpenSheetMusicDisplay(node);

		// Set the options for the OpenSheetMusicDisplay object
		osmd.setOptions({
			backend: 'svg',
			drawTitle: true
		});

		// Load the MusicXML file into the OpenSheetMusicDisplay object
		osmd.load(musicXML).then(() => {
			// Render the score
			osmd.render();
			console.log('render from sheetMusic ❤️:', osmd);
		});
	}
</script>

<FileDropzone name="files" on:drop={onChangeHandler} />
<div id="node" />
