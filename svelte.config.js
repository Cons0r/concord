import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import * as socket from 'socket.io'
import { realtimeapp } from './realtime.js';

const realtimeserver = {
  name: 'realtimedev',
  async configureServer(server) {
    const io = new socket.Server(server.httpServer)
	await realtimeapp(io);
  },
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			out: "out"
		}),
		vite: {
			plugins: [ realtimeserver ]
		}
	}
};

export default config;
