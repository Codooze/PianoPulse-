import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
//TODO Handle errors for type of file submission
/*
APROACHES
🖌️For coloring notes as well as moving the cursor I could use a new function or functions in the update function
*/
class MyOpenSheetMusicDisplay extends OpenSheetMusicDisplay {
	getGraphic() {
		return this.graphic;
	}
}
export function scoreAction(
	node: HTMLElement,
	options: {
		xml: string | File;
		tempTitle?: string;
		running: string;
	}
) {
	const osmd = new MyOpenSheetMusicDisplay(node);
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

				const graphicalNote =
					osmd.getGraphic().measureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0];
				graphicalNote.getSVGGElement().children[0].children[0].children[0].style.fill = '#FFFFFF'; // notehead
				// osmd.cursor
				// 	.GNotesUnderCursor()[0]
				// 	.getSVGGElement().children[0].children[0].children[0].style.stroke = '#FF0000'; // stem
				// osmd.cursor
				// 	.GNotesUnderCursor()[0]
				// 	.getSVGGElement().children[0].children[1].children[0].style.fill = '#FF0000'; // notehead
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
