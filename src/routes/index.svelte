<script context="module">
	export function preload() {
		return this.fetch(`index.json`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>

<script>
	export let posts;
</script>

<style>
</style>

<svelte:head>
	<title>Curio</title>
</svelte:head>

{#each posts as post}
	<!-- we're using the non-standard `rel=prefetch` attribute to
			tell Sapper to load the data for the page as soon as
			the user hovers over the link or taps it, instead of
			waiting for the 'click' event -->
	<h2><a rel="prefetch" href="/{post.slug}">{post.title}</a></h2>
{/each}