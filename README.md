# Vikore Vana

A production-ready affiliate content website for home decor, interior design inspiration, furniture, small-space ideas, and aesthetic living.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Markdown content in `content/articles` and `content/products`
- Decap CMS in `public/admin/config.yml`
- Static generation, sitemap, robots, Open Graph metadata, article schema, Pinterest sharing

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin

The admin dashboard is available at `/admin` and is protected with Basic Auth.

Set these environment variables in Vercel:

```bash
ADMIN_USERNAME=your-admin-user
ADMIN_PASSWORD=your-long-random-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Before launch, update `public/admin/config.yml`:

```yml
backend:
  name: github
  repo: your-github-username/vikore-vana
  branch: main
```

Decap CMS writes new articles to `content/articles`, products to `content/products`, and uploads media to `public/uploads`.

## Deployment

Deploy to Vercel from the GitHub repository. Vercel will run:

```bash
npm run build
```

The site is fully static where possible, with markdown content compiled at build time.
