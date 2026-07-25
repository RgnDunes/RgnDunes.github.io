# Blog HTML Files

Place your HTML blog files in this directory.

## Usage

1. Drop your HTML file here (e.g., `my-article.html`)
2. Reference it in `src/data/blogPosts.ts`:

```typescript
{
  slug: "my-article",
  title: "My Article",
  description: "Article description",
  contentPath: "/blog/my-article.html",  // 👈 Path to your HTML file
  publishedAt: "2026-03-25",
  tags: ["Tag1", "Tag2"],
  readingTime: "5 min read",
  author: { name: "Divyansh Singh" },
}
```

## File Structure

```
public/blog/
├── my-first-article.html
├── my-second-article.html
└── README.md (this file)
```

## Tips

- File names should match the slug (optional but recommended)
- HTML files can be complete documents or just content fragments
- External CSS/JS will be stripped - styling is handled by the portfolio theme
- Images should be placed in `/public/images/blog/` and referenced as `/images/blog/photo.jpg`
