# Personal Portfolio

This is a personal portfolio website built with Next.js, showcasing my skills, projects, and experience.

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages automatically. Here's how it works:

### Automatic Deployment via GitHub Actions

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy to the `gh-pages` branch
3. The site will be available at https://rgndunes.github.io/

### Manual Deployment

If you prefer to deploy manually:

1. Run the build command:

   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

- All content is stored in the data directory
- Styles are managed with Tailwind CSS
- Update the favicon by replacing the image files in the public directory
