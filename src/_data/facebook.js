const PAGE_ID = '426519330535482';
const TOKEN = process.env.META_ACCESS_TOKEN;
const API_VERSION = 'v21.0';
const LIMIT = 6;

const POST_FIELDS = [
  'id',
  'message',
  'permalink_url',
  'created_time',
  'status_type',
  'full_picture',
  'attachments{media,type,url,subattachments{media,type}}',
].join(',');

const FEED_FIELDS = [
  'id',
  'message',
  'permalink_url',
  'created_time',
  'status_type',
  'full_picture',
  'attachments{media,type,url,subattachments{media,type}}',
  'from',
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

// Derive a normalised type string from status_type and attachment type
function resolveType(post) {
  const st = post.status_type;
  const attachType = post.attachments?.data?.[0]?.type || '';
  if (st === 'added_video' || attachType === 'video_inline' || attachType === 'video_autoplay') return 'video';
  if (st === 'added_photos' || attachType === 'photo' || attachType === 'album') return 'photo';
  if (st === 'shared_story' || attachType === 'share') return 'link';
  return 'status';
}

// Extract the best available image URL
function resolveImage(post) {
  // full_picture is the most reliable single-image field
  if (post.full_picture) return post.full_picture;
  // Fall back to first attachment media image
  const firstAttachment = post.attachments?.data?.[0];
  if (firstAttachment?.media?.image?.src) return firstAttachment.media.image.src;
  return null;
}

// Extract carousel images from subattachments
function resolveCarouselImages(post) {
  const first = post.attachments?.data?.[0];
  if (!first?.subattachments?.data?.length) return null;
  return first.subattachments.data
    .map(s => s.media?.image?.src)
    .filter(Boolean);
}

function normalizePost(post) {
  const type = resolveType(post);
  return {
    id: post.id,
    text: post.message || '',
    imageUrl: resolveImage(post),
    carouselImages: resolveCarouselImages(post),
    permalink: post.permalink_url,
    date: post.created_time,
    type,         // 'photo' | 'video' | 'link' | 'status'
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
