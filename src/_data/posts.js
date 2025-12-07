const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'data', 'posts');

function loadPosts(){
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  const posts = files.map(f => {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
      const data = JSON.parse(content);
      const slug = data.slug || (data.title || '').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
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
