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
      streetAddress: "11641 South Ridgeland Ave",
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
    ],
    serviceType: "Ice Cream Truck Catering",
    priceRange: "$$",
    image: "https://windycityicecream.com/main.png",
    sameAs: [],
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
