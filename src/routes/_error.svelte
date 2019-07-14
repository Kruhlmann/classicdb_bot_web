<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === "development";
</script>

<svelte:head>
    <title>Error {status}</title>
</svelte:head>

<h1>{status}: {error.message}</h1>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}

<style lang="scss">
    :global(html) {
        height: 100%;
        background-color: #272727;
    }

    :global(body) {
        height: auto;
        font-family: "Roboto", sans-serif;
        padding: 0;
        margin: 0;
    }
	h1 {
		font-size: 42px;
		text-transform: uppercase;
		font-weight: 300;
		color: white;
		border-bottom: 3px solid #689dc0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
