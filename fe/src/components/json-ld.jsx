import { SERVICE_AREAS } from "../lib/seo/service-areas";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Windy City Ice Cream",
    description:
      "Professional ice cream truck catering for corporate events, parties, and celebrations in Chicago and the suburbs.",
    url: "https://windycityicecream.com",
    telephone: "(708) 529-8875",
    email: "windycityicecream@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11641 South Ridgeland Ave Unit D",
      addressLocality: "Alsip",
      addressRegion: "IL",
      postalCode: "60803",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.6689,
      longitude: -87.7258,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Cook County, IL" },
      { "@type": "AdministrativeArea", name: "Will County, IL" },
      { "@type": "AdministrativeArea", name: "DuPage County, IL" },
      ...SERVICE_AREAS.map((a) => ({ "@type": "City", name: `${a.name}, IL` })),
    ],
    serviceType: "Ice Cream Truck Catering",
    priceRange: "$$",
    image: "https://windycityicecream.com/main.png",
    // Seasonal operation: May through mid-September
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
      validFrom: "2026-05-01",
      validThrough: "2026-09-15",
    },
    sameAs: ["https://www.facebook.com/windycityicecream"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Windy City Ice Cream",
    url: "https://windycityicecream.com",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({ faqs }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
