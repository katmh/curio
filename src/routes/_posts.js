import _ from "lodash";
import all from "../../posts/*.md";

const posts = _.chain(all) // begin a chain
  .map(transform) // transform the shape of each post
  .orderBy("date", "desc") // sort by date descending
  .value(); // convert chain back to array

function transform({ filename, html, metadata }) {
  const slug = filename.replace(/\.md$/, "");
  const date = new Date(metadata.date);
  return { ...metadata, filename, html, slug, date };
}

posts.forEach((post) => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

export const findPost = (slug) => _.find(posts, { slug });
export default posts;
