const IG_USER_ID = '17841421490800808';
const TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = 'v21.0';
const LIMIT = 15;

const FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
].join(',');

module.exports = async function () {
  if (!TOKEN) {
    console.warn('[instagram.js] META_ACCESS_TOKEN not set — skipping fetch.');
    return [];
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${IG_USER_ID}/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${TOKEN}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('[instagram.js] Graph API error:', err?.error?.message || res.status);
      return [];
    }

    const json = await res.json();
    const posts = json.data || [];

    return posts.map((post) => ({
      id: post.id,
      text: post.caption || '',
      // Videos have a thumbnail_url; images and carousels use media_url directly
      imageUrl: post.media_type === 'VIDEO'
        ? (post.thumbnail_url || null)
        : (post.media_url || null),
      videoUrl: post.media_type === 'VIDEO' ? post.media_url : null,
      permalink: post.permalink,
      date: post.timestamp,
      type: post.media_type.toLowerCase(), // 'image' | 'video' | 'carousel_album'
      platform: 'instagram',
    }));
  } catch (err) {
    console.warn('[instagram.js] Fetch failed:', err.message);
    return [];
  }
};
