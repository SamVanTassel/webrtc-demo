<script lang="ts">
	import '../app.css';
	import { user } from '$lib/User.svelte';
	import UsernameModal from './UsernameModal.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

{#if !user.get().name}
	<UsernameModal />
{/if}
<div class="flex max-h-svh flex-col bg-gray-800">
	<div class="flex min-h-16 w-full justify-between bg-gray-950 align-middle text-white">
		<a href="/" class="ml-4 flex items-center text-2xl font-bold">WebRTC Demo</a>
		<span class="mr-4 flex items-center text-xl font-semibold">{user.get().name}</span>
	</div>
	<div class="h-svh">
		{@render children()}
	</div>
</div>
