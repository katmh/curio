---
title: Social meta tags in Gatsby with React Helmet
summary: An art and a science
date: 2020-12-20
---

When you're making a website, you can add certain `<meta>` tags to control how social media platforms like Facebook and Twitter display previews of links to your website. This [CSS Tricks article](https://css-tricks.com/essential-meta-tags-social-media/) provides an overview of what `<meta>` tags are and tells us that these several will cover most of our bases:

```html
<!--essential-->
<meta property="og:title" content="" />
<meta property="og:description" content="" />
<meta property="og:image" content="" />
<meta property="og:url" content="" />
<meta name="twitter:card" content="summary_large_image" />

<!--recommended-->
<meta property="og:site_name" content="" />
<meta name="twitter:image" content="" />
<meta name="twitter:image:alt" content="" />
```

(The `twitter:image` tag wasn't mentioned there but I added it since it doesn't make sense to have the `twitter:image:alt` one otherwise. It's also a pretty visually important one.)

When you're using React or a framework that further abstracts on top of React, like Gatsby or Next.js, the code for the `<head>` of a website isn't really exposed to you. As a result, it can initially be tricky to figure out how to add `<meta>` tags.

The most common way to handle this is using [react-helmet](https://github.com/nfl/react-helmet), an open source package that's actually from the NFL! Yes, the National Football League. react-helmet gives us a component called `<Helmet>`, inside of which we can write our `<head>` tags like `<title>` and `<meta>`.

Nailing the details can be quite subtle at times: getting titles and URLs for different types of pages (e.g. Markdown/MDX, JavaScript), having defaults but allowing for custom `<meta>` values, and even designing appropriately-sized Twitter summary cards. So as I dive into this for a [few](https://weareamericaproject.com) [sites](https://chroma.mit.edu) I'm working on, I wanted to document and share along the way.

## Yuh get into it

If you're using Gatsby, like I do in We Are America and Chroma sites, you'll need the plugin `gatsby-plugin-react-helmet`.

We can make a component, which we'll call `<SEO>`. We can design the component to take in props. That way we can import and include it on individual pages to override default values if needed.

It's common to store site metadata in `gatsby-config.js`, and use GraphQL to fetch tha data. Since we're making a query within a component, we need to use Gatsby's `StaticQuery`.

How can we write the `<title>` code? If there's a page title, it should detect that and add it to the site title. For example, if we're on the About page of a website called MySite, we might expect the title, shown in the tab usually, to be `About | MySite` or `MySite - About`.

## Validating your meta tags

Facebook [Sharing Debugger](https://developers.facebook.com/tools/debug/)

Twitter's [card validator](https://cards-dev.twitter.com/validator)

It's inconvenient to push to production or to a branch and wait for your site to deploy and re-propagate every time you make a change. A way to get around that is to use [ngrok](https://ngrok.com), which lets you point a URL to a local server, as this [Stack Overflow answer](https://stackoverflow.com/questions/32950819/twitter-card-validator-on-localhost) recommends. You can then enter that URL into the validators above.

## How else can you do it?

I mentioned that react-helmet is a common — and as far as I know, standard — solution. How does it work, and how else can you approach this problem?