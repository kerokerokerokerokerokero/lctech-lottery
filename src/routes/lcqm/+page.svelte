<svelte:head>
	<title>LCQM</title>
</svelte:head>

<main>
	<h1>LCQM</h1>
	<p>這是 LCQM 頁面。</p>
</main>

<style>
	main {
		min-height: 100svh;
		display: grid;
		place-content: center;
		gap: 0.75rem;
		text-align: center;
		font-family: system-ui, sans-serif;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 8vw, 3.5rem);
	}

	p {
		margin: 0;
		opacity: 0.75;
	}
</style>
