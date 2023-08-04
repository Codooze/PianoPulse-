<script lang="ts">
	import { scoreAction } from './scoreAction';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import JSZip from 'jszip';

	let musicXML: string | File = '';
	let running = '';
	let file = null;
	async function onChangeHandler(e: Event): Promise<void> {
		const files = (e.target as HTMLInputElement).files;

		if (files && files.length > 0) {
			const file = files[0];
			console.log('file:', file);

			if (file.type === 'application/vnd.recordare.musicxml') {
				console.log('PARSING MUSICXML FILE ..🚀🚀🚀');
				musicXML = file;
			} else {
				const fileURL = URL.createObjectURL(file);
				console.log(typeof fileURL);

				musicXML = fileURL;
			}
			running = file.name;
		}
	}
</script>

<FileDropzone name="files" on:change={onChangeHandler} />

<div use:scoreAction={{ xml: musicXML, running }} />
