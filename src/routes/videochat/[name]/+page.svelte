<script lang="ts">
	import { goto } from '$app/navigation';
	import { mediaManager } from '$lib/MediaManager.svelte.js';
	import { peer } from '$lib/PeerManager.svelte.js';
	import { user } from '$lib/User.svelte.js';
	import type { MediaConnection } from 'peerjs';

	const { data } = $props();
	const { name: peerUsername } = data;

	mediaManager.setLocalStream();

	let videoSelf: HTMLVideoElement | undefined;
	let videoOther: HTMLVideoElement | undefined;

	const conn = peer.getConn();

	$effect(() => {
		if (videoSelf) {
			videoSelf.srcObject = mediaManager.getLocalStream() as MediaStream;
			videoSelf.muted = true;
		}
	});

	if (conn) {
		conn.on('call', function (call) {
			if (!mediaManager.getLocalStream()) {
				mediaManager.setLocalStream();
			}
			call.answer(mediaManager.getLocalStream());
			peerCall = call;
			setCallListeners(call);
		});
	}

	function setCallListeners(call: MediaConnection) {
		call.on('stream', (stream) => {
			if (videoOther) videoOther.srcObject = stream;
		});

		call.on('close', cleanup);
	}

	let peerCall = $state<MediaConnection>();

	$effect(() => {
		if (peer.getRemoteId() && !peerCall) {
			makeCall(peer.getRemoteId());
		}
	});

	const cleanup = () => {
		if (videoOther) videoOther.srcObject = null;
		mediaManager.resetLocalStream();
		peer.setRemoteId('');
		if (peerCall) peerCall.close();
		goto('/');
	};

	const makeCall = (otherId: string) => {
		if (!mediaManager.getLocalStream()) {
			console.log('no local stream :(');
			return;
		}
		if (conn) {
			const call = conn.call(otherId, mediaManager.getLocalStream() as MediaStream);
			setCallListeners(call);
			peerCall = call;
		}
	};

	const endCall = () => {
		if (peerCall) {
			cleanup();
		}
	};
</script>

<div class="grid grid-cols-4 gap-4 p-4">
	<div class="col-1 col-span-2 pl-4">
		<span class="absolute p-4 text-lg text-white">{peerUsername}</span>
		<video class="h-full rounded-md" autoplay bind:this={videoOther}
			><track kind="captions" /></video
		>
	</div>
	<div class="col-3 flex flex-col items-end">
		<span class="absolute p-4 text-lg text-white">{user.get().name}</span>
		<video class="rounded-md" autoplay bind:this={videoSelf}><track kind="captions" /></video>
		{#if peerCall}
			<button
				class="m-8 w-fit flex-grow-0 rounded-md bg-red-600 px-4 py-2 text-white"
				onclick={endCall}>disconnect</button
			>
		{/if}
	</div>
</div>
