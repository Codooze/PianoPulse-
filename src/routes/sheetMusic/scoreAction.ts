import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

/*
Aproches:
- mandar el osmd object para usar su funcion load en el cliente
- CURRENTLY ver porque no se puede retirar correctamente la url en osmd.load
*/

export function scoreAction(
	node: HTMLElement,
	options: {
		xml: string;
		tempTitle?: string;
		running: boolean;
	}
) {
	const osmd = new OpenSheetMusicDisplay(node);
	osmd.setOptions({
		backend: 'svg',
		drawTitle: true
	});
	//tempTitle is used as the title for the piece if there is no title in the XML.
	function updateScore() {
		console.log('loadPromise 🤡', osmd);
		console.log('options 🤡', options.running);

		if (options.running) {
			console.log('Running in scoreUpdate🤡', options.running);
			console.log('Running in scoreUpdate XML🤡', options.xml);

			const loadPromise = osmd.load(options.xml, options.tempTitle);
			loadPromise.then(() => {
				osmd.render();
			});
		}
	}
	updateScore();
	console.log('osmd 🤡');
	return {
		update(updatedOptions: { xml: string; tempTitle?: string; running: boolean }) {
			console.log(updatedOptions.running, options.running);

			if (updatedOptions.running !== options.running) {
				options.running = updatedOptions.running;
				options.xml = updatedOptions.xml;
				// options.tempTitle = updatedOptions.tempTitle;
				console.log('Running in update XML🤡', options.xml);
				console.log('Running in update🤡', options.running);
				updateScore();
			}
			console.log('update 🤡');
		},
		destroy() {
			console.log('running destroy🤡', options.running);
			console.log('destroy 🤡');
		}
	};
}
