const fs = require('fs');
const path = require('path');

const BRANCHES_DIR = path.join(__dirname, 'branches');

function slugify(name) {
  return name
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function loadBranches() {
  if (!fs.existsSync(BRANCHES_DIR)) return [];

  return fs
    .readdirSync(BRANCHES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(BRANCHES_DIR, file), 'utf8'));
      const slug = slugify(raw.name || path.basename(file, '.json'));

      return {
        ...raw,
        key: path.basename(file, '.json'),
        slug,
        url: `/${slug}/`,
      };
    });
}

module.exports = loadBranches();
