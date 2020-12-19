<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		margin: 0 1rem 0 0;
		font: bold 2rem/1 'Andika New Basic', sans-serif;
	}

	h1 a {
		text-decoration: none;
	}

	header p {
		font: normal 1.25rem/1 'Andika New Basic', sans-serif;
		margin: 0;
	}

	.container {
		width: 90%;
		max-width: 700px;
		margin: 2rem auto;
	}
</style>

<header class="container">
	<h1>
		<a href="/">Curio</a>
	</h1>
	<p class="tagline">
		<a href="https://katmh.com">Kat</a>'s technical blog
	</p>
</header>

<section class="container">
	<slot></slot>
</section>