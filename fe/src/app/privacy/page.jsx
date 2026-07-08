"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";

export default function Privacy() {
  return (
    <>
      <section className="relative bg-[#F0FBFF] pb-16 md:pb-24">
        <div className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-24 md:pb-32">
          <Header />
          <span id="main-content" />
          <div className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-15">
            <h1 className="text-3xl md:text-[56px] font-bold text-primary font-archivo uppercase leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[860px] mx-auto mt-2">
              Last updated: July 2026
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center -mt-16 md:-mt-20 px-4 relative z-10">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-md p-6 md:p-10 space-y-6 text-primary font-archivo">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Information we collect</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                When you fill out our contact form, request a quote, or chat with our
                assistant, we collect the details you provide — such as your name,
                email, phone number, event address, and event details. We also use
                Google Analytics to understand how visitors use this site (pages
                viewed, general location, device type).
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">How we use it</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                We use the information you submit to respond to booking inquiries,
                prepare quotes, and coordinate event logistics. We do not sell your
                personal information to third parties. We may share booking details
                with service providers we use to run our business, such as our email
                delivery provider (SendGrid) and payment processor (iPOSpays), solely
                to fulfill your request.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Cookies &amp; analytics</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                This site uses Google Analytics (GA4) cookies to measure site traffic
                and improve our content. You can disable cookies in your browser
                settings; this will not affect your ability to browse the site or
                submit a booking request.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Chat assistant</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                Conversations with our website chat assistant are stored so our team
                can follow up on your inquiry and improve the assistant&apos;s accuracy.
                Do not share sensitive information (such as payment card numbers) in
                the chat.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Your choices</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                To request that we delete information you&apos;ve submitted, email{" "}
                <a href="mailto:windycityicecream@gmail.com" className="text-[#0072B0] underline">
                  windycityicecream@gmail.com
                </a>{" "}
                or call (708) 529-8875.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Contact us</h2>
              <p className="text-sm md:text-[16px] leading-relaxed">
                Windy City Ice Cream, 11641 South Ridgeland Ave Unit D, Alsip, IL 60803.
                Questions about this policy can be sent to{" "}
                <a href="mailto:windycityicecream@gmail.com" className="text-[#0072B0] underline">
                  windycityicecream@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </>
  );
}
