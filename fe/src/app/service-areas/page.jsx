import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import { SERVICE_AREAS, TRAVEL_TIERS } from "../../lib/seo/service-areas";

const SITE_URL = "https://windycityicecream.com";

export const metadata = {
  title: "Service Areas — Chicagoland Ice Cream Truck Catering",
  description:
    "Windy City Ice Cream serves Chicago and suburbs across Cook, Will, and DuPage Counties. Find your town and book an ice cream truck for your next event.",
  alternates: { canonical: `${SITE_URL}/service-areas` },
};

const COUNTIES = ["Cook County", "Will County", "DuPage County"];

export default function ServiceAreasIndex() {
  return (
    <>
      <section className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-16 md:pb-24">
        <Header />
        <div className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-15">
          <p className="text-secound font-architect mb-2 text-sm md:text-[24px]">
            Based in Alsip, IL — serving all of Chicagoland
          </p>
          <h1 className="text-3xl md:text-[56px] font-bold text-primary font-archivo mb-4 uppercase leading-tight">
            Our Service Areas
          </h1>
          <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[860px] mx-auto">
            Windy City Ice Cream brings ice cream truck and pushcart catering
            to Chicago and suburbs throughout Cook, Will, and DuPage Counties.
            Travel fees are based on drive time from our Alsip base — many
            south and southwest suburbs have no travel fee at all.
          </p>
        </div>
      </section>

      <section className="w-full bg-[#F0FBFF] py-14 md:py-20">
        <div className="max-w-[1000px] mx-auto px-4 space-y-10">
          {COUNTIES.map((county) => (
            <div key={county}>
              <h2 className="text-2xl md:text-[32px] font-bold text-primary font-archivo mb-4">
                {county}
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {SERVICE_AREAS.filter((a) => a.county === county).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/service-areas/${a.slug}`}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:bg-[#DAF5FF] transition-colors"
                  >
                    <span className="block text-primary font-bold font-archivo text-lg">
                      {a.name}, IL
                    </span>
                    <span className="block text-sm text-[#0072B0] font-archivo mt-1">
                      {TRAVEL_TIERS[a.tier].label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <p className="text-primary text-sm md:text-[16px] font-archivo max-w-[760px] mx-auto">
              Don&apos;t see your town? We cover most addresses within about 75
              minutes of Alsip — including many more suburbs than listed here.
              Ask our chat assistant for an instant travel-fee estimate, or
              reach out for a quote.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-5 bg-[#0072B0] text-white px-6 py-3 rounded-r-full text-sm md:text-[16px] font-archivo transform transition-all duration-200 hover:scale-105"
            >
              Check My Address
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </>
  );
}
