import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Chatbot from "../../../components/Chatbot";
import { SERVICE_AREAS, TRAVEL_TIERS, getServiceArea } from "../../../lib/seo/service-areas";

const SITE_URL = "https://windycityicecream.com";

export function generateStaticParams() {
  return SERVICE_AREAS.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const area = getServiceArea(city);
  if (!area) return {};
  return {
    title: `Ice Cream Truck Catering in ${area.name}, IL`,
    description: `Book an ice cream truck for your ${area.name} event. Windy City Ice Cream serves ${area.name} and all of ${area.county} with truck and pushcart catering for parties, schools, and corporate events.`,
    alternates: { canonical: `${SITE_URL}/service-areas/${area.slug}` },
  };
}

export default async function ServiceAreaPage({ params }) {
  const { city } = await params;
  const area = getServiceArea(city);
  if (!area) notFound();

  const tier = TRAVEL_TIERS[area.tier];
  const nearby = SERVICE_AREAS.filter((a) => a.slug !== area.slug).slice(0, 6);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Ice Cream Truck Catering",
    provider: {
      "@type": "FoodEstablishment",
      name: "Windy City Ice Cream",
      url: SITE_URL,
      telephone: "(708) 529-8875",
    },
    areaServed: { "@type": "City", name: `${area.name}, IL` },
    url: `${SITE_URL}/service-areas/${area.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-16 md:pb-24">
        <Header />
        <div className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-15">
          <p className="text-secound font-architect mb-2 text-sm md:text-[24px]">
            Serving {area.county}
          </p>
          <h1 className="text-3xl md:text-[56px] font-bold text-primary font-archivo mb-4 uppercase leading-tight">
            Ice Cream Truck Catering in {area.name}, IL
          </h1>
          <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[860px] mx-auto">
            {area.blurb}
          </p>
        </div>
      </section>

      <section className="w-full bg-[#F0FBFF] py-14 md:py-20">
        <div className="max-w-[1000px] mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-[28px] font-bold text-primary font-archivo mb-3">
              Travel Fee for {area.name}
            </h2>
            <p className="text-primary text-sm md:text-[16px] font-archivo">
              {area.name} is {tier.detail}. Our truck service is $100 per hour
              (with a $90 minimum), ice cream is a flat $4.00 per piece, and we
              also offer pushcart service for indoor venues and multi-shift
              coverage. Get an instant estimate from our chat assistant or{" "}
              <Link href="/pricing" className="underline text-[#0072B0]">
                see full pricing
              </Link>
              .
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-[28px] font-bold text-primary font-archivo mb-3">
              Popular {area.name} Events
            </h2>
            <ul className="list-disc list-inside text-primary text-sm md:text-[16px] font-archivo space-y-1">
              {area.popularEvents.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 mt-10 text-center">
          <h2 className="text-2xl md:text-[36px] font-bold text-primary font-archivo mb-3">
            Why {area.name} Books Windy City Ice Cream
          </h2>
          <p className="text-primary text-sm md:text-[16px] font-archivo max-w-[820px] mx-auto">
            We&apos;re a woman-owned business based in Alsip, Illinois, serving
            the Chicago area for over a decade. Every booking includes a
            professional, uniformed driver, name-brand frozen treats from Good
            Humor, Blue Bunny, and Mars, and menu customization — including
            nut-free options for schools and workplaces. We operate May through
            mid-September, and {area.name} summer dates fill up fast.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 bg-[#0072B0] text-white px-6 py-3 rounded-r-full text-sm md:text-[16px] font-archivo transform transition-all duration-200 hover:scale-105"
          >
            Get a {area.name} Quote
          </Link>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 mt-14">
          <h2 className="text-lg md:text-[22px] font-bold text-primary font-archivo mb-3 text-center">
            Other Areas We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {nearby.map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className="bg-white text-primary text-sm font-archivo px-4 py-2 rounded-full shadow-sm hover:bg-[#DAF5FF] transition-colors"
              >
                {a.name}
              </Link>
            ))}
            <Link
              href="/service"
              className="bg-white text-[#0072B0] text-sm font-archivo px-4 py-2 rounded-full shadow-sm hover:bg-[#DAF5FF] transition-colors"
            >
              Full service area →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </>
  );
}
