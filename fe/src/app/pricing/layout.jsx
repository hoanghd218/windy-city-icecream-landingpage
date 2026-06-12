import { FaqJsonLd } from "../../components/json-ld";
import { PRICING_FAQS } from "../../lib/seo/pricing-faqs";

export const metadata = {
  title: "Pricing — Ice Cream Truck Catering Cost in Chicago",
  description:
    "Transparent ice cream truck catering pricing: $100/hour truck service, $4 per piece, travel fees by distance. Serving Cook, Will, and DuPage Counties.",
  alternates: {
    canonical: "https://windycityicecream.com/pricing",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <FaqJsonLd faqs={PRICING_FAQS} />
      {children}
    </>
  );
}
