<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/db';
	import { peer } from '$lib/PeerManager.svelte';
	import { user } from '$lib/User.svelte';
	import { addDoc, collection, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';

	const { peerUsername } = $props();

	let modal: HTMLDialogElement;
	const closeModal = () => modal.close();

	let awaitingResponse = $state(false);
	$effect(() => {
		// retrieve queries
		const responsesCollection = collection(db, 'responses');
		const q = query(responsesCollection, where('respondent', '==', peerUsername));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const d = querySnapshot.docChanges();
			const lastResponse = d[d.length - 1];
			if (!lastResponse) return;
			const data = lastResponse.doc.data();
			peer.setRemoteId(data.peerId);
			awaitingResponse = false;
			deleteDoc(lastResponse.doc.ref);

			goto(`/videochat/${peerUsername}`);
			closeModal();
		});
		return unsubscribe;
	});

	const requestsCollection = collection(db, 'requests');

	const startChat = async () => {
		await addDoc(requestsCollection, {
			inviter: user.get().name,
			invitee: peerUsername,
			peerId: peer.getId()
		});
		awaitingResponse = true;
	};
</script>

<button onclick={() => modal.showModal()}>📹</button>

<dialog bind:this={modal} class="rounded-md">
	<div
		class="flex h-40 w-fit flex-col justify-between rounded-md bg-white p-8 shadow-md shadow-gray-800"
	>
		{#if awaitingResponse}
			<h2 class="text-xl font-semibold">waiting for {peerUsername}'s response</h2>
			<p>you will be redirected to a video chat if they accept your invite</p>
			<div class="flex justify-end">
				<button class="rounded-m mr-4 mt-2 p-2" onclick={closeModal}>give up</button>
			</div>
		{:else}
			<h2 class="text-xl font-semibold">invite {peerUsername} to chat?</h2>
			<div class="flex justify-end">
				<button class="rounded-m mr-4 p-2" onclick={closeModal}>cancel</button>
				<button class="rounded-md bg-gray-800 p-2 px-4 text-white" onclick={startChat}>yes</button>
			</div>
		{/if}
	</div>
</dialog>
