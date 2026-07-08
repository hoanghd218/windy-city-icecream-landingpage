import { buildPageMetadata } from "../../lib/seo/page-metadata";
import { BreadcrumbJsonLd } from "../../components/json-ld";

export const metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Learn about Windy City Ice Cream, Chicago's favorite ice cream truck catering service — our fleet, menus, and professional drivers.",
  path: "/about",
});

export default function Layout({ children }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "About Us", url: "https://windycityicecream.com/about" },
        ]}
      />
      {children}
    </>
  );
}
