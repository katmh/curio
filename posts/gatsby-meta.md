---
title: Social meta tags in Gatsby with React Helmet
summary: The scenic route
date: 2020-12-23
---

When you're making a website, you can add certain `<meta>` tags to control how social media platforms like Facebook and Twitter display previews of links to your site. This [CSS Tricks article](https://css-tricks.com/essential-meta-tags-social-media/) provides an overview of what `<meta>` tags are and tells us that these several cover most of our bases:

```html
<!--essential-->
<meta property="og:title" content="" />
<meta property="og:description" content="" />
<meta property="og:image" content="" />
<meta property="og:url" content="" />
<meta name="twitter:card" content="summary_large_image" />

<!--recommended-->
<meta property="og:site_name" content="" />
<meta name="twitter:image:alt" content="" />
```

When you're using React or a framework that further abstracts on top of React, like Gatsby or Next.js, the code for the document `<head>` isn't really exposed to you. It can initially be tricky to figure out how to add `<meta>` tags.

The most common way to handle this is using [react-helmet](https://github.com/nfl/react-helmet), an open source package developed by the NFL — yes, the National Football League. The package gives us a component called `<Helmet>`, inside of which we can write our `<head>` tags like `<title>` and `<meta>`. `<Helmet>` can be rendered multiple times, letting us override default values with page-specific ones.

Nailing the details can be subtle: getting titles and URLs of different types of pages (e.g. Markdown/MDX), setting defaults while allowing for custom values, and even designing appropriately-sized Twitter summary cards.

I dove into this for a [few](https://weareamericaproject.com) [sites](https://chroma.mit.edu) I'm working on and arrived at something similar to [this video tutorial](https://www.youtube.com/watch?v=Y2gweJCaHz0), but I wanted document it into words and cover some adjacent topics I encountered along the way.

## Installing packages

If you're using Gatsby, you'll need the plugin `gatsby-plugin-react-helmet` in addition to `react-helmet`. Gatsby plugins allow other plugins to work with Gatsby APIs. After installing `gatsby-plugin-react-helmet`, add it to your `gatsby-config.js` file:

```shell
npm install gatsby-plugin-react-helmet react-helmet
```

```javascript
{
  plugins: [`gatsby-plugin-react-helmet`]
}
```

## Where to put metadata

It's considered best practice to put our meta values in `gatsby-config.js`. It gives us a nice central location where we can store and update all this information. We can then query this data using GraphQL to fill in our `<meta>` tags.

```javascript
module.exports = {
  siteMetadata: {
    title: "Severus Snape",
    titleTemplate: "%s · The Real Hero",
    description:
      "Hogwarts Potions master, Head of Slytherin house and former Death Eater.",
    url: "https://www.doe.com",
    image: "https://www.doe.com/images/snape.jpg",
  },
}
```

GraphQL is just a language for querying data. You can use it with pretty much any project that involves interacting with a database, regardless of the programming langugages it's implemented in. You don't have to use GraphQL with Gatsby, but this and plugins are some of the advantages of Gatsby, letting you pull in data and functionality from many different sources.

## SEO component: Boilerplate and querying data

We then [make a component](https://www.gatsbyjs.com/docs/add-seo-component/) that contains the `<Helmet>` component and all the logic to fill out its attributes. I'll call the component `<SEO>`, but you can call it anything you want. Here's a boilerplate:

```jsx
import React from "react"
import { Helmet } from "react-helmet"

const SEO = ({ title, description, image, article }) => {
  return (
    <Helmet>
      <title></title>
      <!--other meta tags will go here-->
    </Helmet>
  )
}

export default SEO
```

We can design the component to take in props. That way we can import and include it on individual pages to override default values if needed. Note that here I've written it so that we're [destructuring our props](https://medium.com/@lcriswell/destructuring-props-in-react-b1c295005ce0).

To query from a component rather than a page, we need to use Gatsby's `StaticQuery` API, which gets evaluated and fetches and injects data at build time. They're called static because unlike page components, they don't accept variables. Here's what that looks like:

```graphql
{
  site {
    siteMetadata {
      title
      titleTemplate
      url
      description
      image
    }
  } 
}
```

Let's break down the query itself. We import the `graphql` tag

```jsx
import React from "react"
import { Helmet } from "react-helmet"
import { StaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image }) => {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              titleTemplate
              url
              description
              image
            }
          } 
        }
      `}
      render={
        data => {
          return (
            <Helmet>
              <title></title>
              <!--other meta tags will go here-->
            </Helmet>
          )
        }
    }>
  )
}

export default SEO
```

The thing we want to render goes in the `render` prop. We can also use the hook `useStaticQuery`. It does the same thing but you might prefer the syntax.

```jsx
import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image, article }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          titleTemplate
          url
          description
          image
        }
      } 
    }
  `)
  return (
    <Helmet>
      <title></title>
      <!--other meta tags will go here-->
    </Helmet>
  )
}

export default SEO
```


## SEO component: Title template and canonical URL

How can we write the `<title>` code? If there's a page title, it should detect that and add it to the site title. For example, if we're on the About page of a website called MySite, we might expect the title, shown in the tab usually, to be `About | MySite` or `MySite - About`.

`<Helmet>` provides us with a prop called `titleTemplate`. If we pass in the value `%s | MyAwesomeWebsite.com`, then if an individual page provides `<title>Nested Title</title>`, the component will output `<title>Nested Title | MyAwesomeWebsite.com</title>`, according to [react-helmet's reference guide](https://github.com/nfl/react-helmet#reference-guide).

https://www.gatsbyjs.com/docs/location-data-from-props/

https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Choosing_between_www_and_non-www_URLs


## SEO component: Custom values for meta tags

How do we let individual pages override this? In our SEO component, we can define variables using the `OR` `||` operator, which will return the second argument if the first one is "falsy." We can add to our SEO component:

```javascript
const seo = {
  title: title || defaultTitle,
  description: description || defaultDescription,
  image: `${siteUrl}${image || defaultImage}`,
  url: `${siteUrl}${pathname}`,
}
```

We can put the `<meta>` tags inside the `<Helmet>` component or pass them in as a list to the `meta` prop. Altogether, the component looks like this:

```jsx
```

You can import it on a page like this and pass in props:

```jsx
```

What about MDX pages? Those can import and use the SEO component. What about plain Markdown pages?

## Validating your meta tags

Okay, that should be everything. We can preview what our social cards will look like using Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) and Twitter's [card validator](https://cards-dev.twitter.com/validator).

But wait: It's inconvenient to push to production or to a branch and wait for your site to deploy and re-propagate every time you make a change. A way to get around that is to use [ngrok](https://ngrok.com), which lets you point a URL to a local server, as this [Stack Overflow answer](https://stackoverflow.com/questions/32950819/twitter-card-validator-on-localhost) recommends. You can then enter that URL into the validators above.

Make sure to use `gatsby build && gatsby serve` to test on what would be the production version of your site. Typically this outputs to port 9000, so your ngrok command would be `ngrok http 9000`.

## Notes on card images

For a while I was frustrated because my Twitter card image wasn't showing up. I dug around [this Twitter FAQ](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/troubleshooting-cards) and [card guidelines](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image) and found a few preferences and requirements for these images:

- The image should be _insert dimensions_
- The file should be smaller than 5 MB for Twitter's webcrawler to pick it up
- Maybe the file was cached, causing an old version to show up. You can get around this by adding parameters to the end of the URL so the webcrawler treats it as a new resource.

My image was the right dimensions and size, and nothing at all was showing up, so the last point was moot. Ultimately I ended up fixing my issue by making the meta tag value be the full path to the image: `https://website.com/imagename.jpg` rather than just `/imagename.jpg`. This doesn't seem to be super well documented, but it seems to be [the case by design](https://stackoverflow.com/questions/9858577/open-graph-can-resolve-relative-url). It had me stumped for a while, so I thought I'd mention it.

## Final result

This may seem like a lot but it's because I wanted to go into some detail about how and why every adjacent thing, from the `graphql` tag to `react-helmet` itself, worked. Link to demo and source code

Also this article is not particularly original. It consolidates my findings on the topic and adjacent topics from several documentation pages, articles, and videos. Gatsby's documentation itself also has a [guide](https://www.gatsbyjs.com/tutorial/seo-and-social-sharing-cards-tutorial/) that covers much of the same thing.