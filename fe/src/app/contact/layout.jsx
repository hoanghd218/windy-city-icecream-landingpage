import { buildPageMetadata } from "../../lib/seo/page-metadata";
import { BreadcrumbJsonLd } from "../../components/json-ld";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Windy City Ice Cream to book an ice cream truck for your next event. Call (708) 529-8875 or fill out our contact form.",
  path: "/contact",
});

export default function Layout({ children }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "Contact Us", url: "https://windycityicecream.com/contact" },
        ]}
      />
      {children}
    </>
  );
}
