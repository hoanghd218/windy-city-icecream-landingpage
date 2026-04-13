"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  /* last section */
  const wrapRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapRef.current) return;
      const items = wrapRef.current.children;
      if (items[0]) gsap.from(items[0], { y: -80, opacity: 0, duration: 2, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 80%" } });
      if (items[1]) gsap.from(items[1], { x: -120, opacity: 0, duration: 2, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 80%" } });
      if (items[2]) gsap.from(items[2], { y: 80, opacity: 0, duration: 2, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 80%" } });
      if (leftImgRef.current) gsap.from(leftImgRef.current, { x: -200, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 80%" } });
      if (rightImgRef.current) gsap.from(rightImgRef.current, { x: 200, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 80%" } });
      [leftImgRef.current, rightImgRef.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { y: -20, duration: 2 + i * 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
    });
    return () => ctx.revert();
  }, []);

  /* first section */
  const serviceBgRef = useRef(null);
  const serviceTextRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // BG - top thi neeche reveal
      gsap.fromTo(
        serviceBgRef.current,
        { clipPath: "ellipse(120% 0% at 50% 0%)" },
        { clipPath: "ellipse(200% 200% at 50% 0%)", duration: 3, ease: "power3.out" }
      );
      // Heading - top thi neeche stagger
      gsap.from(serviceTextRef.current?.children || [], {
        y: -50, opacity: 0, stagger: 0.15, duration: 0.9, delay: 0.3, ease: "power3.out",
      });
      // White card - bottom thi upar + fade in
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 80, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── FIRST SECTION ── */}
      <section className="relative bg-[#F0FBFF] pb-16 md:pb-24">
        {/* Blue BG */}
        <div
          ref={serviceBgRef}
          className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-40 md:pb-56"
        >
          <Header />
          <div
            className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-25"
            ref={serviceTextRef}
          >
            <h1 className="text-3xl md:text-[60px] font-bold text-primary font-archivo uppercase">
              Pricing and services
            </h1>
          </div>
        </div>

        {/* White card - half BG andar half bahar */}
        <div className="w-full flex justify-center -mt-24 md:-mt-32 px-4 relative z-10">
          <div
            ref={cardRef}
            className="bg-white w-full max-w-5xl rounded-xl shadow-md p-6 md:p-10 mx-auto text-center"
          >
            <p className="text-[#00334E] md:text-[24px] text-[16px] text-center font-semibold font-archivo mb-20">
              Our pricing and Services depend on Location, Order Volume and
              Event. Each product of service provided is agreed upon before
              the event or location.
            </p>
            <p className="text-[#00334E] md:text-[20px] text-[14px] text-center font-bold font-archivo mb-3">
              Pricing Details
            </p>
            <p className="text-[#00334E] md:text-[16px] text-[16px] text-center font-archivo mb-3">
              Pricing may vary depending on your event details. Factors such
              as travel mileage, event type, and the number of guests can
              affect the final cost. To receive accurate pricing tailored to
              your needs, please start a chat with our team.
            </p>
            <p className="text-[#00334E] md:text-[16px] text-[14px] text-center font-semibold font-archivo mb-3">
              Pricing is determined based on mileage, event type, and guest
              count.
            </p>
            <button className="bg-[#0072B0] text-white px-4 py-2 rounded-l-full text-sm md:text-[16px] btn2">
              Chat for Pricing
            </button>
          </div>
        </div>
      </section>

      {/* ── LAST SECTION ── */}
      <section className="w-full bg-white py-20 md:py-28 flex justify-center">
        <div className="w-full max-w-375 px-4 relative flex items-center justify-center">
          <Image
            ref={leftImgRef}
            src="/cendy4.png"
            alt=""
            width={200}
            height={200}
            className="hidden md:block absolute left-0 bottom-0 w-30 md:w-40 lg:w-50 h-auto"
          />
          <Image
            ref={rightImgRef}
            src="/icecon.png"
            alt=""
            width={220}
            height={220}
            className="hidden md:block absolute right-0 bottom-0 w-30 md:w-45 lg:w-55 h-auto"
          />
          <div ref={wrapRef} className="text-center lg:max-w-[842px] z-10">
            <h2 className="text-2xl md:text-4xl lg:text-[50px] font-bold text-primary font-archivo leading-tight">
              READY TO BRING AN ICE CREAM TRUCK TO YOUR EVENT?
            </h2>
            <p className="mt-4 text-primary text-sm md:text-[22px]">
              With hundreds of satisfied customers all over Chicago...
            </p>
            <button className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer mt-3">
              <span className="relative z-10">Reach out</span>
              <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 cursor-pointer"></span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </>
  );
}
