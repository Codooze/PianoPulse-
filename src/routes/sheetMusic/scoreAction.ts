import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
//TODO Handle errors for type of file submission
export function scoreAction(
	node: HTMLElement,
	options: {
		xml: string | File;
		tempTitle?: string;
		running: string;
	}
) {
	const osmd = new OpenSheetMusicDisplay(node);
	osmd.setOptions({
		backend: 'svg',
		drawTitle: true,
		// drawUpToMeasureNumber: 10, // Draw up to measure 10
		// drawUpToPageNumber: 2,
		drawingParameters: 'compact',
		followCursor: true
		// renderSingleHorizontalStaffline
	});
	//tempTitle is used as the title for the piece if there is no title in the XML.
	function updateScore() {
		console.log(options.xml);

		if (!options.running) {
			return;
		}

		if (typeof options.xml === 'string') {
			renderSheetMusic(options.xml);
			return;
		}

		if (!(options.xml instanceof File)) {
			return;
		}

		const reader = new FileReader();
		reader.onload = function (res) {
			const musicXml = res.target?.result;
			if (typeof musicXml === 'string') {
				renderSheetMusic(musicXml);
			}
		};
		reader.readAsBinaryString(options.xml);

		function renderSheetMusic(musicXml: string) {
			const loadPromise = osmd.load(musicXml, options.tempTitle);
			loadPromise.then(() => {
				osmd.render();
			});
		}
	}
	updateScore();
	console.log('osmd 🤡');
	return {
		update(updatedOptions: { xml: string; tempTitle?: string; running: string }) {
			if (updatedOptions.running !== options.running) {
				options.running = updatedOptions.running;
				options.xml = updatedOptions.xml;
				// options.tempTitle = updatedOptions.tempTitle;
				updateScore();
				console.log('updateScore 🤡');
			}
			console.log('update 🤡');
		},
		destroy() {
			console.log('destroy 🤡');
		}
	};
}
