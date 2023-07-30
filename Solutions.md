## Server side rendering & fetching

GitHub Copilot: Yes, you could also fetch the sheet music file in a SvelteKit server page instead of using an API endpoint. Here's an example of how you could modify your code to fetch the sheet music file in a server page:

1. Create a server page in your SvelteKit app that accepts a request for a sheet music file, fetches the file from the database, generates the sheet music using the `OpenSheetMusicDisplay` class, and returns it as a response. Here's an example:

   ```typescript
   // src/routes/sheet-music/[id].ts
   import type { Request, Response } from '@sveltejs/kit';
   import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
   import { getSheetMusicById } from '../../database';

   export async function get({ params }: Request): Promise<Response> {
   	const { id } = params;
   	const sheetMusic = await getSheetMusicById(id);
   	const osmd = new OpenSheetMusicDisplay();
   	osmd.setOptions({
   		backend: 'svg',
   		drawTitle: true
   	});
   	const loadPromise = osmd.load(sheetMusic.xml);

   	await loadPromise;

   	osmd.render();

   	const svg = osmd.SVGContainer.innerHTML;

   	return {
   		body: svg,
   		headers: {
   			'Content-Type': 'image/svg+xml'
   		}
   	};
   }
   ```

   In this example, we're creating a server page that accepts a request for a sheet music file with a specific ID, fetches the file from the database using the `getSheetMusicById` function, generates the file using the `OpenSheetMusicDisplay` class, and returns it as an SVG response.

2. Modify your `score.svelte` file to fetch the sheet music file from the server page using the `fetch` function. Here's an example:

   ```ts
   <script lang="ts">
     import { onMount } from 'svelte';

     let sheetMusic: string;

     onMount(async () => {
       const response = await fetch(`/sheet-music/${id}`);
       sheetMusic = await response.text();
     });
   </script>

   <div id="sheetMusic" class="max-w-[80%]" innerHTML={sheetMusic} />
   ```

   In this example, we're using the `fetch` function to fetch the sheet music file from the server page, and setting the `sheetMusic` variable to the response text. We're then using the `innerHTML` directive to render the sheet music as HTML.

With this approach, the sheet music files will be fetched from the database and generated on-demand as they are requested by the user, instead of being pre-rendered during the build process. This can help reduce the size of the build and improve performance. However, it may also result in slower load times for the first user to request a particular sheet music file, as the file will need to be fetched from the database and generated on the server.
