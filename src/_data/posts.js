const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: true });
const POSTS_DIR = path.join(__dirname, '..', 'data', 'posts');

function normalizeSlug(data){
  return data.slug || (data.title || '').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function normalizePostData(raw){
  const content = (raw.content || '').toString();
  const { data: frontMatter = {}, content: markdownBody = '' } = matter(content);

  const trimmedBody = markdownBody.trim();
  const normalized = {
    ...raw,
    // allow front matter to override common fields
    title: frontMatter.title || raw.title || '',
    // Keep problem: createdAt should remain the issue creation time, but date should
    // default to issue's latest update time so editing the issue updates the post date.
    createdAt: raw.createdAt,
    date: frontMatter.date || raw.updatedAt || raw.createdAt,
    tags: frontMatter.tags || raw.labels || [],
    seo_description: frontMatter.seo_description || raw.excerpt || '',
    mainImage: frontMatter.mainImage || raw.mainImage || '',

    // keep the original raw content in case you want it later
    rawContent: content,

    // expose the markdown body (front matter removed)
    body: trimmedBody,
    content: trimmedBody,

    // render markdown to HTML for templates
    contentHtml: md.render(trimmedBody),

    // keep front matter for other uses
    frontMatter,
  };

  // provide an excerpt from the markdown body (first paragraph)
  const excerpt = normalized.body.split(/\n\n+/)[0].replace(/\n/g,' ').trim();
  normalized.excerpt = excerpt;

  return normalized;
}

function loadPosts(){
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  const posts = files.map(f => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
      const raw = JSON.parse(content);
      const data = normalizePostData(raw);
      const slug = normalizeSlug(data);

      return {
        data,
        // expected URL pattern for each post
        url: `/${slug}/`
      };
    } catch (e){
      console.error('Failed to parse', f, e);
      return null;
    }
  }).filter(Boolean);

  // sort by id (assuming id is numeric issue number) descending
  posts.sort((a,b) => (b.data.id || 0) - (a.data.id || 0));
  return posts;
}

module.exports = loadPosts();
