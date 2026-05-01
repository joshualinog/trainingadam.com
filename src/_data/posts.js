const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: true, linkify: true });

function extractYouTubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function isShorts(url) {
  return /youtube\.com\/shorts\//.test(url);
}

function embedYouTube(html) {
  // Replace <p> tags containing only a YouTube link with a click-to-play facade embed
  return html.replace(
    /<p><a[^>]+href="(https?:\/\/(?:www\.)?(?:youtu\.be|youtube\.com)[^"]+)"[^>]*>[^<]*<\/a><\/p>/g,
    (match, url) => {
      const id = extractYouTubeId(url);
      if (!id) return match;
      const shorts = isShorts(url);
      const aspectClass = shorts ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video w-full';
      const watchUrl = shorts
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`;
      const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      const embedSrc = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      // Facade: show thumbnail + play button; click swaps in the iframe (autoplay)
      return `<figure class="my-8 not-prose">
  <div class="relative ${aspectClass} rounded-xl overflow-hidden bg-black cursor-pointer group"
       onclick="var d=this;d.innerHTML='<iframe class=\\'absolute inset-0 w-full h-full\\' src=\\'${embedSrc}\\' allow=\\'autoplay;accelerometer;clipboard-write;encrypted-media;gyroscope;picture-in-picture\\' allowfullscreen></iframe>'">
    <img src="${thumbnail}" alt="YouTube video" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="rounded-full bg-black/60 p-4 group-hover:bg-blazing-flame-500 transition-colors">
        <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg>
      </div>
    </div>
  </div>
  <figcaption class="mt-2 text-center"><a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="text-sm text-blazing-flame-500 hover:underline">Watch on YouTube ↗</a></figcaption>
</figure>`;
    }
  );
}
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
    mainImage: frontMatter.mainImage || raw.mainImage || null,

    // keep the original raw content in case you want it later
    rawContent: content,

    // expose the markdown body (front matter removed)
    body: trimmedBody,
    content: trimmedBody,

    // render markdown to HTML for templates (with YouTube auto-embed)
    contentHtml: embedYouTube(md.render(trimmedBody)),

    // keep front matter for other uses
    frontMatter,
  };

  // provide an excerpt from the markdown body (first non-heading paragraph)
  const paragraphs = normalized.body.split(/\n\n+/);
  const firstBodyPara = paragraphs.find(p => !p.trim().startsWith('#')) || paragraphs[0];
  normalized.excerpt = firstBodyPara.replace(/\n/g, ' ').trim();

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
