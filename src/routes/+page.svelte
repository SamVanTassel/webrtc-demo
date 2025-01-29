<script lang="ts">
	import { db } from '$lib/db';
	import { collection, query, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
	import ChatBox from '$lib/ChatBox.svelte';
	import ChatInviteModal from './AcceptInviteModal.svelte';
	import { peer } from '$lib/PeerManager.svelte';
	import { user } from '$lib/User.svelte';

	const messagesCollection = collection(db, 'messages');

	let inviter = $state({
		username: '',
		peerId: ''
	});

	let inviteOpen = $state(false);

	$effect(() => {
		// retrieve queries
		const requestsCollection = collection(db, 'requests');
		const q = query(requestsCollection, where('invitee', '==', user.get().name));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const d = querySnapshot.docChanges();
			const lastInvite = d[d.length - 1];
			if (!lastInvite) return;
			const data = lastInvite.doc.data();
			if (data) inviter = {
				username: data.inviter,
				peerId: data.peerId
			};
			peer.setRemoteId(data.peerId);
			inviteOpen = true;
			deleteDoc(lastInvite.doc.ref);
		});
		return unsubscribe;
	});
</script>

{#if inviter.peerId && inviter.username && inviteOpen}
	<ChatInviteModal peerUsername={inviter.username} isOpen={inviteOpen}/>
{/if}
<div class="flex h-full flex-col items-center">
	<ChatBox {messagesCollection} />
</div>
