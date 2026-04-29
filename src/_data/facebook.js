const PAGE_ID = '426519330535482';
const TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = 'v21.0';
const LIMIT = 6;

const POST_FIELDS = [
  'id',
  'message',
  'story',
  'permalink_url',
  'created_time',
  'type',
  'attachments{media,type}',
].join(',');

const FEED_FIELDS = [
  'id',
  'message',
  'permalink_url',
  'created_time',
  'type',
  'from',
  'attachments{media,type}',
].join(',');

async function getPageAccessToken() {
  const url = `https://graph.facebook.com/${API_VERSION}/${PAGE_ID}?fields=access_token&access_token=${TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(json?.error?.message || 'Could not retrieve Page Access Token');
  }
  return json.access_token;
}

function extractImage(post) {
  const attachment = post.attachments?.data?.[0];
  if (!attachment) return null;
  // Carousel: grab first child
  if (attachment.subattachments?.data?.[0]?.media?.image?.src) {
    return attachment.subattachments.data[0].media.image.src;
  }
  return attachment.media?.image?.src || null;
}

function normalizePost(post) {
  return {
    id: post.id,
    text: post.message || post.story || '',
    imageUrl: extractImage(post),
    permalink: post.permalink_url,
    date: post.created_time,
    type: post.type,
    platform: 'facebook',
    author: post.from?.name || null,
  };
}

module.exports = async function () {
  if (!TOKEN) {
    console.warn('[facebook.js] META_ACCESS_TOKEN not set — skipping fetch.');
    return { posts: [], visitorPosts: [] };
  }

  let pageToken;
  try {
    pageToken = await getPageAccessToken();
  } catch (err) {
    console.warn('[facebook.js] Page token error:', err.message);
    return { posts: [], visitorPosts: [] };
  }

  // Fetch page's own posts
  let posts = [];
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/posts?fields=${POST_FIELDS}&limit=${LIMIT}&access_token=${pageToken}`
    );
    const json = await res.json();
    if (json.error && json.error.code !== 12) {
      console.warn('[facebook.js] /posts error:', json.error.message);
    } else if (json.data) {
      posts = json.data.map((p) => normalizePost(p));
    }
  } catch (err) {
    console.warn('[facebook.js] /posts fetch failed:', err.message);
  }

  // Fetch full feed and filter to visitor posts only
  let visitorPosts = [];
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/feed?fields=${FEED_FIELDS}&limit=20&access_token=${pageToken}`
    );
    const json = await res.json();
    if (json.error && json.error.code !== 12) {
      console.warn('[facebook.js] /feed error:', json.error.message);
    } else if (json.data) {
      visitorPosts = json.data
        .filter((p) => p.from?.id && p.from.id !== PAGE_ID)
        .slice(0, LIMIT)
        .map((p) => normalizePost(p));
    }
  } catch (err) {
    console.warn('[facebook.js] /feed fetch failed:', err.message);
  }

  return { posts, visitorPosts };
};
