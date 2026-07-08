import { buildPageMetadata } from "../../lib/seo/page-metadata";
import { BreadcrumbJsonLd } from "../../components/json-ld";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Windy City Ice Cream collects, uses, and protects information from our website, contact form, and chat assistant.",
  path: "/privacy",
});

export default function Layout({ children }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "Privacy Policy", url: "https://windycityicecream.com/privacy" },
        ]}
      />
      {children}
    </>
  );
}
