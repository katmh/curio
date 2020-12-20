<script context="module">
	export function preload() {
		return this.fetch(`index.json`)
			.then((r) => r.json())
			.then((posts) => {
				return { posts };
			});
	}
</script>

<script>
	import { onMount } from "svelte";
	let Prism;
	let code = "let b = 4;";
	onMount(async () => {
		// Load the prismjs first after the page is loaded
		const prismModule = await import("svelte-prismjs");
		await import("prismjs/components/prism-c.js");
		await import("prism-svelte");
		await import("prismjs/plugins/line-highlight/prism-line-highlight.js");
		await import("prismjs/plugins/file-highlight/prism-file-highlight.js");
		// Once everything is loaded load the prismjs module
		Prism = prismModule.default;
		setInterval(() => {
			code = code == "let b = 4;" ? "let c = 323;" : "let b = 4;";
			console.log("should notice change");
		}, 3000);
	});

	export let posts;
</script>

<style>
</style>

<svelte:head>
	<title>Curio</title>
</svelte:head>

{#each posts as post}
	<article class="post">
		<!-- `rel=prefetch` attribute tells Sapper to load the data
				for the page as soon as the user hovers over the link
				or taps it, instead of waiting for the 'click' event -->
		<h2 class="post_title">
			<a rel="prefetch" href="/{post.slug}">{post.title}</a>
		</h2>
		<p class="date">{post.date}</p>
		<p class="summary">{post.summary}</p>
	</article>
{/each}
