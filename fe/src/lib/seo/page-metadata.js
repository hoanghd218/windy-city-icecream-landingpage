// Builds per-page metadata so openGraph/twitter urls match each page's own
// canonical instead of inheriting the root layout's fixed homepage url.
const SITE_URL = "https://windycityicecream.com";
const DEFAULT_OG_IMAGE = {
  url: "/main.png",
  width: 1200,
  height: 630,
  alt: "Windy City Ice Cream truck serving at an event",
};

export function buildPageMetadata({ title, description, path }) {
  const canonical = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
