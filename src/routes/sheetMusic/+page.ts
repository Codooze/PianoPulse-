import component from './score.svelte';

export function load() {
	//TODO Make a post Api to post the component to the server, that could be done in /api/saveSheet.ts
	//TODO here I should fetch the component from the server to send it to the client

	return {
		hi: 'hi',
		component
	};
}
