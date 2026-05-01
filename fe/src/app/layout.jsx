import "./globals.css";
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/json-ld";

const SITE_URL = "https://windycityicecream.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Windy City Ice Cream | Chicago's Premier Ice Cream Truck Catering",
    template: "%s | Windy City Ice Cream",
  },
  description:
    "Windy City Ice Cream brings the joy of ice cream truck catering to Chicago and the suburbs. Serving Cook, Will, and DuPage Counties for corporate events, parties, and celebrations.",
  keywords: [
    "ice cream truck catering",
    "Chicago ice cream truck",
    "ice cream catering Chicago",
    "corporate ice cream catering",
    "event ice cream truck",
    "Cook County ice cream",
    "DuPage County ice cream",
    "Will County ice cream",
    "Alsip ice cream",
    "party ice cream truck",
  ],
  authors: [{ name: "Windy City Ice Cream" }],
  creator: "Windy City Ice Cream",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Windy City Ice Cream",
    title: "Windy City Ice Cream | Chicago's Premier Ice Cream Truck Catering",
    description:
      "Bring the joy of ice cream to your next event! Windy City Ice Cream serves Cook, Will, and DuPage Counties with professional ice cream truck catering.",
    images: [
      {
        url: "/main.png",
        width: 1200,
        height: 630,
        alt: "Windy City Ice Cream truck serving at an event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Windy City Ice Cream | Chicago's Premier Ice Cream Truck Catering",
    description:
      "Bring the joy of ice cream to your next event! Professional ice cream truck catering in Chicago and suburbs.",
    images: ["/main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-clip">
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
        {children}
      </body>
    </html>
  );
}
