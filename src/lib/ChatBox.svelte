<script lang="ts">
	import { user } from '$lib/User.svelte';
	import type { Message as MessageType } from '$lib/types';
	import { addDoc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
	import Message from '../routes/PublicMessage.svelte';

	const { messagesCollection } = $props();

	let chatbox: HTMLDivElement;
	let messages: MessageType[] = $state([]);

	$effect(() => {;
		// retrieve last 5 minutes of messages
		const q = query(messagesCollection, orderBy('timestamp'), where('timestamp', '>', Date.now() - 300000), limit(100));

		const newMessages: MessageType[] = [];

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			newMessages.length = 0;
			querySnapshot.forEach((doc) => {
				const data = doc.data() as MessageType;
				newMessages.push({
					id: doc.id,
					text: data.text,
					username: data.username,
					timestamp: data.timestamp
				});
			});
			messages = newMessages;
		});
		return unsubscribe;
	});

	$effect(() => {
		messages;
		chatbox.scrollTop = chatbox.scrollHeight;
	})

	let messageText = $state('');

	const sendMessage = async () => {
		await addDoc(messagesCollection, {
			username: user.get().name,
			text: messageText,
			timestamp: Date.now()
		});
		messageText = '';
	};
</script>

<div class="h-4/6 w-9/12 bg-gray-700 flex flex-col">
	<div
		bind:this={chatbox}
		class="m-4 w-[calc(100%-2rem)] overflow-auto rounded-lg bg-white p-4"
	>
		{#each messages as message (message.id)}
			<Message username={message.username} text={message.text} />
		{/each}
	</div>

	<div class="m-4 flex w-[calc(100%-2rem)]">
		<form class="flex w-full" onsubmit={sendMessage}>
			<input
				autocomplete="off"
				class="mr-4 w-full rounded-md p-2 text-black outline-none"
				type="text"
				name="text"
				bind:value={messageText}
			/>
			<input type="hidden" name="username" value={user.get().name} />
			<button type="submit" class="rounded-md bg-red-400 p-2">send</button>
		</form>
	</div>
</div>
