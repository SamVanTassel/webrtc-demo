<script lang="ts">
	import { user } from '$lib/User.svelte';

	let element: HTMLDialogElement;
	let text = $state('');

	const saveUsername = () => {
		user.setName(text);
	};

	$effect(() => {
		if (element) element.showModal();
	});
</script>

<dialog
	class="mt-16 flex h-full w-full justify-center bg-white/30 p-0 align-middle backdrop-blur-sm"
	bind:this={element}
	aria-modal="true"
>
	<div class="m-auto h-fit rounded-lg bg-white p-6 shadow-lg">
		<h2 class="mb-4 text-lg font-semibold">Enter a username</h2>
		<form onsubmit={saveUsername} method="dialog" class="flex">
			<input
				class="mr-4 border-b-2 border-b-black outline-none"
				type="text"
				autocomplete="off"
				placeholder="enter a username"
				bind:value={text}
			/>
			<button class="flex items-center rounded-md bg-red-300 p-2" type="submit">set username</button
			>
		</form>
	</div>
</dialog>
