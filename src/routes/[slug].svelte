<script context="module">
	import { findPost } from "./_posts";
	// sapper calls this to load our data
	export function preload({ params }) {
		// `slug` parameter available b/c this file is [slug].svelte
		const post = findPost(params.slug);
		// return a list of props
		return { post };
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

	export let post;
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
	.content :global(h2) {
		font: bold 1.4rem/1 "Andika New Basic", sans-serif;
		margin-top: 2rem;
	}

	.content :global(pre code) {
		display: block;
		font: normal 0.9rem/150% "Inconsolata", Monaco, monospace;
		overflow-x: auto;
		padding: 0.75rem 1rem;
		border-radius: 10px;
	}
</style>

<svelte:head>
	<title>{post.title}</title>
</svelte:head>

<h1 class="post_title">{post.title}</h1>
<p class="date">
	{post.date.toUTCString().split(',').slice(1)[0].split('00').slice(0, 1)}
</p>
<div class="content">
	{@html post.html}
</div>
