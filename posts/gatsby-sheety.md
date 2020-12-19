---
title: "Edit a Gatsby site from a spreadsheet"
summary: "Frictionless to update, thanks to Gatsby, Sheety API, Google Sheets, and Zapier."
date: 2019-12-30
---


I recently made [Learned](https://tilearned.netlify.com) ([source code](https://github.com/katavie/learned)).

![Screenshot of Learned (tilearned.netlify.com)](../../static/learned-preview.png)

Every few days, I add a snippet about something I learned that day. Later, when I get more content, I might add features like filtering by topic.

It looks underwhelmingly simple at the moment, but I designed it to be extremely frictionless to update, with the help of [GatsbyJS](https://gatsbyjs.org), [Sheety](https://sheety.co/), Google Sheets, and [Zapier](https://zapier.com/).

The website pulls content from a Google Sheet using the Sheety API. Through a Zapier integration, the website is re-deployed on Netlify every time I update the Google Sheet.

Here's how I made it:

1. Start a Gatsby project
2. Set up your spreadsheet and Sheety
3. Get data from the Sheety API
4. Display the data on a page
5. Deploy to Netlify
6. Make the Zapier integration to automate updates

## 1. Start a Gatsby project

Make sure you have the Gatsby CLI installed (and [Node.js](https://nodejs.org/en/), if you don't already).

```shell
npm install -g gatsby-cli
```

In your terminal, navigate to whatever directory you want this project to be in. Run this command to start a project using [Gatsby's hello-world boilerplate](https://github.com/gatsbyjs/gatsby-starter-hello-world).

```shell
gatsby new learned https://github.com/gatsbyjs/gatsby-starter-hello-world
```

This clones the boilerplate into a folder called `learned`. You can make sure it runs by running these commands and going to `localhost:8000`, which should just display "Hello world!"

```shell
cd learned
gatsby develop
```

Note that the hello-world boilerplate is about as minimal as it gets—you can find other "starters" with more good stuff out-of-the-box in this [Starter Library](https://www.gatsbyjs.org/starters/?v=2).

## 2. Set up your spreadsheet and Sheety

Let's switch gears and create a Google Sheet. The location of it in your Google Drive doesn't matter, because Sheety just relies on the URL, which stays the same. The way you format it also doesn't matter too much, but it'll make your life easier to keep column and sheet names URL-friendly/slug-friendly.

Here's how I formatted mine:

!["How I set up my Google Sheet for Learned"](../../static/learned-spreadsheet.png "google sheets: my preferred content management system")

Next, make an account on [Sheety](https://sheety.co/). Make sure to sign in using a Google account that has access to the Google Sheet you just made.

Create a new project on Sheety—this should be pretty straightforward. You can get your Google Sheet's URL by enabling link sharing for the file.

Feel free to poke around the Settings and API Endpoints tabs. For this guide, we won't require any authentication for access to our Sheety API endpoints, and the only HTTP method we're using is GET.

Here's my endpoint schema, from the API Endpoints tab of Sheety. If you don't see anything here yet, 1) make sure you have column titles in your spreadsheet and 2) try clicking Sync on Sheety.

!["My endpoint schema on Sheety"](../../static/learned-schema.png "My endpoint schema on Sheety")

## 3. Get data from the Sheety API

Cool, now let's make it so that our Gatsby website can send requests to the API we just set up and get the spreadsheet's contents in response.

To make those API calls, we'll use a plugin called `gatsby-source-rest-api` ([documentation](https://www.gatsbyjs.org/packages/gatsby-source-rest-api/)).

To install the plugin, run this command in your project directory:

```shell
npm install --save gatsby-source-rest-api
```

Then update `gatsby-config.js` to include the plugin. Get the endpoint URL from Sheety.

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-rest-api`,
      options: {
        endpoints: [
          "https://v2-api.sheety.co/userID/projectName/sheetName", // put your endpoint URL here!
        ],
      },
    },
  ],
}
```

Now let's check that this is working. Start (or restart) the development server by running `gatsby develop`. Then head to `localhost:8000/___graphql`. This page contains a tool called [GraphiQL](https://www.gatsbyjs.org/docs/running-queries-with-graphiql/), which helps you explore your site's data and write queries—in a query language called GraphQL—to access it. These queries can then be used in your pages and components.

If the plugin we just installed is properly getting data from the API, you should see something in the Explorer of GraphiQL that starts with `allRestApi...`. You can click on it to start building your query. Then click the play/triangle button, which runs the query and returns its result, some JSON, in the third column.

!["How I built my GraphQL query in GraphiQL"](../../static/learned-query.gif "making some tasteful selections from my GraphQL menu 😋")

Here's the query I ended up with:

```graphql
query MyQuery {
  allRestApiYeetyLearnedSheet {
    nodes {
      sheet {
        date
        lesson
      }
    }
  }
}
```

## 4. Display the data on a page

Now we can use this query to include the data Sheety got for us on our website's pages. Here's a way you could do that:

```javascript
import { graphql } from "gatsby"

const IndexPage = ({ data }) => {
  return (
    <div>
      <h1>something I learned on...</h1>
      {data.allRestApiBlah.nodes[0].sheet.map((sheet) => {
        return (
          <article>
            <h2>{sheet.lesson ? sheet.date : null}</h2>
            <p dangerouslySetInnerHTML={\{__html: (sheet.lesson ? sheet.lesson : null)}\} />
          </article>
        )
      }
    </div>
  )
}

export const query = graphql`
query MyQuery {
  allRestApiBlah {
    nodes {
      sheet {
        date
        lesson
      }
    }
  }
}
`
```

Breaking down this code:

- First, we import `graphql`, which we use to make the query defined at the bottom of this code.
- To give our page the retrieved data, we pass `{data}` into `IndexPage`. As a result, inside `IndexPage`, we can access the data using JSX and parse it like any other JSON object. For example, `{data.allRestApiBlahBlahBlah.nodes[0].sheet[0].date}` gets the first date in my data.
- We want to do something to each entry in our data, so we'll use `map`. The `map` function takes a function as its argument and applies it to every entry.
- Personally, I don't want an entry to appear at all if there's only a date in my spreadsheet and no lesson for it yet, so I used the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). The markup for `h2` says: if `sheet.lesson` exists (causing the expression to return `true`), then return `sheet.date`. Otherwise, return `null`, which won't show anything.
- Personally, I also like to write HTML straight into my spreadsheet to add some formatting to my entries: bold, italics, line breaks, etc. To render as HTML (instead of as a string, like `<b>owo</b>`) we have to use `dangerouslySetInnerHTML` ([documentation](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)).

If you want to query the data on a component that then gets included in pages, you'll need to [use StaticQuery](https://www.gatsbyjs.org/docs/static-query/) instead.

I included only the bare minimum in this code, but here's what my live version actually looks like ([source code](https://github.com/katavie/learned/blob/master/src/pages/index.js)):

![Screenshot of Learned (tilearned.netlify.com)](../../static/learned-preview.png)

## 5. Deploy to Netlify

I stored all my code in a Github repository, so it was easy to deploy it to [Netlify](https://www.netlify.com/) and get the site live using all the default settings. You can find actual instructions [here](https://www.gatsbyjs.org/docs/deploying-to-netlify/).

## 6. Make the Zapier integration ⚡

If you stopped here, you'd still have to manually trigger a deployment on Netlify every time you wanted to update the website. That lowkey defeats the purpose of having this Sheety API setup—personally, I wanted to be able to just edit my spreadsheet and have my website automatically update.

To do that, sign up for Zapier using a Google account that has access to your spreadsheet. Then make a Zap so that when there's a new or updated row in Google Sheets, a deployment will be started on Netlify. (When the deployment happens, Gatsby will send a brand new request to the Sheety API, which grabs the most up-to-date information from your spreadsheet.)

![Screenshot of how my Zapier zap works](../../static/learned-zapier.png)

## Yay

That's all! Again, my version of this site is at [tilearned.netlify.com](http://tilearned.netlify.com) and the source code is at [github.com/katavie/learned](https://github.com/katavie/learned). If you have any questions or want to share what you made, feel free to contact me at [hello@katmh.com](mailto:hello@katmh.com) or [@katmhuang](https://twitter.com/katmhuang) on Twitter.