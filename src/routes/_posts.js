import _ from "lodash";
import all from "../../posts/*.md";

export const posts = _.chain(all) // begin a chain
  .map(transform) // transform the shape of each post
  .orderBy("date", "desc") // sort by date descending
  .value(); // convert chain back to array

// function for reshaping each post
function transform({ filename, html, metadata }) {
  // permalink is filename with .md extension removed
  const slug = filename.replace(/\.md$/, "");

  // convert date string to proper Date object
  const date = new Date(metadata.date);

  // return new shape
  return { ...metadata, filename, html, slug, date };
}

// provide a way to find a post by permalink
export function findPost(slug) {
  // use lodash to find by field name
  return _.find(posts, { slug });
}

posts.forEach((post) => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

export default posts;
