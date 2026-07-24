"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useState, useEffect } from "react";
import "highlight.js/styles/atom-one-dark.css";

interface MarkdownRendererProps {
  content?: string;
  contentPath?: string; // Path to HTML file in /public/blog/
  contentType?: "markdown" | "html";
}

export default function MarkdownRenderer({
  content,
  contentPath,
  contentType = "markdown"
}: MarkdownRendererProps) {
  const [loadedContent, setLoadedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If contentPath is provided, fetch the HTML file
  useEffect(() => {
    if (contentPath) {
      setIsLoading(true);

      // Add basePath for GitHub Pages deployment
      // Check if we're on GitHub Pages by looking at hostname
      const isGitHubPages = typeof window !== "undefined" &&
        window.location.hostname.includes("github.io");
      const basePath = isGitHubPages ? "/Portfolio-v5" : "";
      const fullPath = `${basePath}${contentPath}`;

      fetch(fullPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load content from ${fullPath}`);
          }
          return response.text();
        })
        .then((html) => {
          setLoadedContent(html);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [contentPath]);

  const finalContent = loadedContent || content || "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <p className="text-red-800">Error loading article: {error}</p>
        <p className="mt-2 text-sm text-red-600">
          Make sure the HTML file exists at: <code>{contentPath}</code>
        </p>
      </div>
    );
  }

  // If content is pure HTML (or loaded from file), render it directly with styling
  if (contentType === "html" || contentPath) {
    return (
      <div
        className="prose prose-lg prose-slate max-w-none
          prose-headings:font-serif prose-headings:text-[#0f0e0c]
          prose-h1:text-4xl prose-h1:font-black prose-h1:leading-tight prose-h1:mt-12 prose-h1:mb-6
          prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-5
          prose-h3:text-xl prose-h3:font-bold prose-h3:italic prose-h3:mt-8 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:text-[#0f0e0c] prose-p:mb-5
          prose-a:text-saffron prose-a:no-underline prose-a:decoration-saffron/30 hover:prose-a:decoration-saffron
          prose-blockquote:border-l-4 prose-blockquote:border-saffron prose-blockquote:pl-7
          prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-[#0f0e0c]
          prose-code:bg-rule/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#0f0e0c]
          prose-pre:bg-[#1e1e1e] prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-ul:list-disc prose-ul:space-y-2 prose-ul:text-[#0f0e0c]
          prose-ol:list-decimal prose-ol:space-y-2 prose-ol:text-[#0f0e0c]
          prose-li:leading-relaxed
          prose-strong:font-semibold prose-strong:text-[#0f0e0c]
          prose-em:italic
          prose-hr:border-rule prose-hr:my-12
          prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: finalContent }}
      />
    );
  }

  // Otherwise, render as markdown
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-12 mb-6 font-serif text-4xl font-black leading-tight text-gray-900">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-10 mb-5 font-serif text-3xl font-bold text-gray-900">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 mb-4 font-serif text-xl font-bold italic text-gray-900">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-5 leading-relaxed text-gray-700">{children}</p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-orange-500 pl-7 font-serif text-xl italic leading-snug text-gray-800">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="my-6 list-disc space-y-2 pl-6 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-6 list-decimal space-y-2 pl-6 text-gray-700">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        code: ({ inline, children, ...props }: any) => {
          if (inline) {
            return (
              <code className="rounded bg-rule/30 px-1.5 py-0.5 font-mono text-sm text-ink">
                {children}
              </code>
            );
          }
          return (
            <code className="block" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-8 overflow-x-auto rounded-lg bg-[#1e1e1e] p-6">
            {children}
          </pre>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-saffron underline decoration-saffron/30 transition-colors hover:decoration-saffron"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-12 border-rule" />,
        strong: ({ children }) => (
          <strong className="font-semibold text-ink">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
