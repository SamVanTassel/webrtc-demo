<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/db';
	import { peer } from '$lib/PeerManager.svelte';
	import { user } from '$lib/User.svelte';
	import { collection, addDoc } from 'firebase/firestore';

	const { peerUsername, isOpen } = $props();

	let modal: HTMLDialogElement;
	const closeModal = () => modal.close();

	const acceptInvite = () => {
		const responsesRef = collection(db, 'responses');
		addDoc(responsesRef, {
			respondent: user.get().name,
			peerId: peer.getId()
		});
		goto(`/videochat/${peerUsername}`);
	};
</script>

<dialog class="rounded-md" open={isOpen} bind:this={modal}>
	<div
		class="flex h-40 w-fit flex-col justify-between rounded-md bg-white p-8 shadow-md shadow-gray-800"
	>
		<h2 class="text-xl font-semibold">Accept video chat invite from {peerUsername}?</h2>
		<div class="flex justify-end">
			<button class="rounded-m mr-4 p-2" onclick={closeModal}>no</button>
			<button onclick={acceptInvite} class="rounded-md bg-gray-800 p-2 px-4 text-white">yes</button>
		</div>
	</div>
</dialog>
