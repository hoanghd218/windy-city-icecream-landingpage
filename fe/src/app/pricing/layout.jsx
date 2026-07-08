import { FaqJsonLd, BreadcrumbJsonLd } from "../../components/json-ld";
import { PRICING_FAQS } from "../../lib/seo/pricing-faqs";
import { buildPageMetadata } from "../../lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Pricing — Ice Cream Truck Catering Cost in Chicago",
  description:
    "Transparent ice cream truck catering pricing: $100/hour truck service, $4 per piece, travel fees by distance. Serving Cook, Will, and DuPage Counties.",
  path: "/pricing",
});

export default function Layout({ children }) {
  return (
    <>
      <FaqJsonLd faqs={PRICING_FAQS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://windycityicecream.com" },
          { name: "Pricing", url: "https://windycityicecream.com/pricing" },
        ]}
      />
      {children}
    </>
  );
}
