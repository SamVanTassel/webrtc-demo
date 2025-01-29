<script lang="ts">
	import { user } from '$lib/User.svelte';
	import StartChatModal from './RequestChatModal.svelte';
	const { username, text } = $props();
</script>

{#if user.get().name === username}
	<div class="m-1 ml-auto flex w-fit justify-end rounded-md bg-gray-200 p-2">
		{text}
	</div>
{:else}
	<div class="m-1 mr-auto flex w-fit flex-col justify-start rounded-md bg-blue-400 p-2">
		<div class="flex justify-between">
			<span class="font-semibold">{username}</span>
			<StartChatModal peerUsername={username} />
		</div>
		<span class="pl-2">{text}</span>
	</div>
{/if}
