const https = require('https');

const CHANNEL_ID = 'UC0QvZbD75rCMc5yEJEamDAQ';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchURL(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractTagContent(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
}

function extractAttr(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}[^>\\s]*(?:\\s[^>]*)??\\s${attr}="([^"]*)"`, 'i'));
  return match ? match[1] : '';
}

module.exports = async function () {
  try {
    const xml = await fetchURL(FEED_URL);
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    return entries.map(([, entry]) => {
      const videoId = extractTagContent(entry, 'yt:videoId');
      const title = extractTagContent(entry, 'title');
      const published = extractTagContent(entry, 'published');
      const description = extractTagContent(entry, 'media:description');
      const thumbnailUrl =
        extractAttr(entry, 'media:thumbnail', 'url') ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title,
        published,
        description,
        thumbnail: thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      };
    });
  } catch (err) {
    console.warn('[videos.js] YouTube RSS fetch failed:', err.message);
    return [];
  }
};
