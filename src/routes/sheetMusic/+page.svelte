<script lang="ts">
	import { scoreAction } from './scoreAction';
	import { FileDropzone, SlideToggle } from '@skeletonlabs/skeleton';

	let musicXML: string | File = '';
	let running = '';
	let isMXL = false;
	async function onChangeHandler(e: Event): Promise<void> {
		const files = (e.target as HTMLInputElement).files;
		console.log(files);

		if (files && files.length > 0) {
			const file = files[0];
			console.log('file:', file);

			if (isMXL) {
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
<SlideToggle name="slider-label" bind:checked={isMXL}>mxl</SlideToggle>

<div use:scoreAction={{ xml: musicXML, running }} />
