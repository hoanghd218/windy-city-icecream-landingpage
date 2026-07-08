import { buildPageMetadata } from "../../lib/seo/page-metadata";
import { BreadcrumbJsonLd } from "../../components/json-ld";

export const metadata = buildPageMetadata({
  title: "Refund & Cancellation Policy",
  description:
    "Windy City Ice Cream's 30-day cancellation policy. Learn about our refund terms for ice cream truck catering bookings.",
  path: "/refunds",
});

export default function Layout({ children }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "Refunds & Cancellation", url: "https://windycityicecream.com/refunds" },
        ]}
      />
      {children}
    </>
  );
}
