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
