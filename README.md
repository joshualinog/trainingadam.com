# TEST

# Eleventy + Tailwind CSS + GitHub Pages + Custom Domain Template

A starter template for static sites using Eleventy, Tailwind CSS, and GitHub Pages with custom domain support. All common deployment and configuration gotchas are solved.

## Features

- Eleventy static site generator
- Tailwind CSS with PostCSS and Autoprefixer
- GitHub Actions for CI/CD
- Automatic CNAME passthrough for custom domains
- Correct asset paths for GitHub Pages
- Ready for deployment at domain root

## Setup

1. **Clone this repo**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set your custom domain**
   - Edit the `CNAME` file and replace `your-custom-domain.com` with your domain.
4. **Configure DNS**
   - Apex domain: Add A records for 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - www: Add a CNAME record pointing to `<your-github-username>.github.io`
5. **Build and serve locally**
   ```sh
   npm start
   ```
6. **Deploy**
   - Push to GitHub. GitHub Actions will build and deploy to GitHub Pages automatically.

## Google Fonts & Typography

### Rubik Font

- This template uses the [Rubik](https://fonts.google.com/specimen/Rubik) font from Google Fonts as the default sans-serif font for all text.
- All 9 font weights (100–900) are loaded for maximum flexibility.
- The font is loaded via `<link>` tags in `src/_includes/layout.njk`.
- Tailwind is configured to use Rubik as the default `font-sans` in `tailwind.config.js`.
- The main heading (`h1`) uses Rubik Black (font-weight 900) for a bold, impactful look.

### Custom Styles

- The file `src/assets/styles.css` is the main entry for Tailwind and any custom CSS.
- A custom `.rubik-black` class is defined in `styles.css` to ensure the `h1` uses Rubik Black (900).
- You can add more custom styles to this file as needed; they will be processed by PostCSS and included in the build.

## Gotchas Solved

- CNAME file is always copied to the output directory.
- Asset paths use Eleventy’s `url` filter for compatibility.
- `pathPrefix` is `/` for custom domain root.
- Example DNS and deployment instructions included.

## Troubleshooting

- If your custom domain is removed, check that the CNAME file is present in the published branch after deploy.
- For 404 errors on CSS, ensure asset paths use the `url` filter and the CSS file exists in `_site/assets/`.
- For domain verification, add a TXT record if GitHub Pages requests it.

---

MIT License
