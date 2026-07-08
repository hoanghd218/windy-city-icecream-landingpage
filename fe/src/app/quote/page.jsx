import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuoteForm from "../../components/QuoteForm";
import PhoneCta from "../../components/PhoneCta";

const SITE_URL = "https://windycityicecream.com";

export const metadata = {
  title: "Chicago Ice Cream Truck Catering | Get a Free Quote",
  description:
    "Book an ice cream truck or cart for your Chicago-area event. Woman-owned, serving Cook, DuPage & Will Counties for corporate events, parties, and celebrations. Get a free quote today.",
  alternates: { canonical: `${SITE_URL}/quote` },
  robots: { index: true, follow: true },
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-10 md:pb-14">
        <Header />
        <div className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-14">
          <p className="text-secound font-architect mb-2 text-sm md:text-[24px]">
            Woman-Owned • Serving Cook, DuPage & Will Counties
          </p>
          <h1 className="text-3xl md:text-[48px] font-bold text-primary font-archivo mb-4 uppercase leading-tight">
            Chicago Ice Cream Truck Catering
          </h1>
          <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[720px] mx-auto">
            Trusted by Chicago companies for corporate events, birthdays,
            weddings & school events. Tell us about your event and get a free,
            no-obligation quote in minutes.
          </p>
          <div className="mt-6">
            <PhoneCta source="quote_hero" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs md:text-sm font-archivo">
            {["Woman-Owned", "All Event Sizes", "Premium Flavors", "Cook / DuPage / Will"].map(
              (badge) => (
                <span
                  key={badge}
                  className="bg-white/80 text-primary px-4 py-2 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F0FBFF] py-12 md:py-16">
        <div className="max-w-[640px] mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-[24px] font-bold text-primary font-archivo mb-1">
              Get Your Free Quote
            </h2>
            <p className="text-sm text-gray-600 font-archivo mb-5">
              Reserve early — summer dates fill up fast. Prefer to talk?{" "}
              <PhoneCta
                source="quote_form"
                className="text-[#0072B0] underline font-semibold"
              />
            </p>
            <QuoteForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
