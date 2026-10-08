import { useEffect } from "react";

/**
 * PageHead — per-page SEO for the OwnStakeX SPA.
 * Sets document title, meta description, canonical, OG/Twitter tags,
 * JSON-LD (WebPage + BreadcrumbList) and robots. App screens pass noindex.
 */
const SITE_URL = "https://ownstakex.com";
const SITE_NAME = "OwnStakeX";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

function upsertMeta(attr, key, value, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content ?? value);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function PageHead({
  title,
  description,
  path = "/",
  image,
  noindex = false,
  breadcrumbs = [],
  type = "website",
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Own a Stake in Real Opportunities`;
    document.title = fullTitle;

    if (description) upsertMeta("name", "description", null, description);
    upsertMeta("name", "robots", null, noindex ? "noindex, nofollow" : "index, follow");

    const url = `${SITE_URL}${path}`;
    upsertLink("canonical", url);

    const ogImage = image || DEFAULT_OG_IMAGE;
    upsertMeta("property", "og:title", null, fullTitle);
    if (description) upsertMeta("property", "og:description", null, description);
    upsertMeta("property", "og:type", null, type);
    upsertMeta("property", "og:url", null, url);
    upsertMeta("property", "og:site_name", null, SITE_NAME);
    upsertMeta("property", "og:image", null, ogImage);
    upsertMeta("name", "twitter:card", null, "summary_large_image");
    upsertMeta("name", "twitter:title", null, fullTitle);
    if (description) upsertMeta("name", "twitter:description", null, description);
    upsertMeta("name", "twitter:image", null, ogImage);

    // Google Search Console verification (set VITE_GSC_VERIFICATION in .env.production)
    const gsc = import.meta.env.VITE_GSC_VERIFICATION;
    if (gsc) upsertMeta("name", "google-site-verification", null, gsc);

    // JSON-LD: WebPage + BreadcrumbList
    let ld = document.head.querySelector('script[data-pagehead="ld"]');
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("data-pagehead", "ld");
      document.head.appendChild(ld);
    }
    const graph = [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: fullTitle,
        url,
        ...(description ? { description } : {}),
      },
    ];
    if (breadcrumbs.length) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      });
    }
    ld.textContent = JSON.stringify(graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph });

    return () => {
      // keep tags for crawlers that execute JS once; harmless on navigation
    };
  }, [title, description, path, image, noindex, type, JSON.stringify(breadcrumbs)]);

  return null;
}

export const HOME_CRUMB = { name: "Home", path: "/" };
