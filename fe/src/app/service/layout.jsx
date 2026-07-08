import { buildPageMetadata } from "../../lib/seo/page-metadata";
import { BreadcrumbJsonLd } from "../../components/json-ld";

export const metadata = buildPageMetadata({
  title: "Service Area",
  description:
    "Windy City Ice Cream serves Cook County, Will County, and DuPage County in Illinois. Check if we cover your area for ice cream truck catering.",
  path: "/service",
});

export default function Layout({ children }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "Service Area", url: "https://windycityicecream.com/service" },
        ]}
      />
      {children}
    </>
  );
}
