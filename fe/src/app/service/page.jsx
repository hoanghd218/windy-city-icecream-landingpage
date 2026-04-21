"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Service() {
  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
    "/image4.png",
    "/image5.png",
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let scrollAmount = 0;
    let rafId;
    let lastTime = performance.now();

    const scroll = (now) => {
      const dt = now - lastTime;
      lastTime = now;
      scrollAmount += (dt / 20) * 0.5;
      if (scrollAmount >= container.scrollWidth / 2) scrollAmount = 0;
      container.scrollLeft = scrollAmount;
      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* fifth section */
  const textWrapRef = useRef(null);
  const circleRef = useRef(null);
  const s5BtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: textWrapRef.current, start: "top 80%" };
      const [p1, h2, p2] = textWrapRef.current.children;

      gsap.set(circleRef.current, { scale: 0, opacity: 0, force3D: true });
      gsap.set([p1, h2, p2, s5BtnRef.current], { opacity: 0, force3D: true });
      gsap.set(p1, { y: -40 });
      gsap.set(h2, { y: -50 });
      gsap.set(p2, { y: 40 });
      gsap.set(s5BtnRef.current, { y: 30, scale: 0.85 });

      gsap.to(circleRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: circleRef.current, start: "top 85%" },
      });

      gsap.to(p1, { scrollTrigger: trigger, y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
      gsap.to(h2, { scrollTrigger: trigger, y: 0, opacity: 1, duration: 0.8, delay: 0.12, ease: "power3.out" });
      gsap.to(p2, { scrollTrigger: trigger, y: 0, opacity: 1, duration: 0.7, delay: 0.24, ease: "power3.out" });
      gsap.to(s5BtnRef.current, {
        scrollTrigger: trigger,
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: 0.38,
        ease: "back.out(1.7)",
      });
    });
    return () => ctx.revert();
  }, []);

  /* last section */
  const wrapRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = wrapRef.current.children;
      const st = { trigger: wrapRef.current, start: "top 80%" };

      gsap.set([items[0], items[1], items[2], leftImgRef.current, rightImgRef.current], { opacity: 0, force3D: true });
      gsap.set(items[0], { y: -80 });
      gsap.set(items[1], { x: -120 });
      gsap.set(items[2], { y: 80 });
      gsap.set(leftImgRef.current, { x: -200 });
      gsap.set(rightImgRef.current, { x: 200 });

      gsap.to(items[0], { scrollTrigger: st, y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
      gsap.to(items[1], { scrollTrigger: st, x: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
      gsap.to(items[2], { scrollTrigger: st, y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
      gsap.to(leftImgRef.current, {
        scrollTrigger: st,
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(leftImgRef.current, { y: -20, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        },
      });
      gsap.to(rightImgRef.current, {
        scrollTrigger: st,
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(rightImgRef.current, { y: -20, duration: 2.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* service section */

const serviceBgRef = useRef(null);
const serviceMapRef = useRef(null);
const serviceTextRef = useRef(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const textChildren = serviceTextRef.current?.children || [];

    gsap.to(serviceMapRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });

    gsap.to(textChildren, {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
    });
  });
  return () => ctx.revert();
}, []);

  return (
    <>
      <section className="relative bg-[#F0FBFF]">
         <div ref={serviceBgRef} className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-32 md:pb-60">
          <Header />

          <div
            className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-15 *:opacity-0 *:-translate-y-[50px] *:will-change-transform"
            ref={serviceTextRef}
          >
            <h1 className="text-3xl md:text-[60px] font-bold text-primary font-archivo mb-4 uppercase">
              Service Area
            </h1>

            <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[919px] mx-auto font-semobold mb-5">
              Windy City Ice Cream proudly serves most of Cook County, Will
              County, and DuPage County.
            </p>

            <p className="text-sm md:text-[16px] text-primary font-archivo max-w-[919px] mx-auto">
              If you’re in the greater Chicago area and looking to bring a
              little nostalgia and sweetness to your event, we’re just a call or
              click away! Need an ice cream truck to stop by your block party,
              graduation, birthday, family celebration, or workplace? Surprise
              your employees with a cool treat on a hot summer day—they’ll love
              it! You don’t just book an ice cream truck—you create lasting
              memories for your guests, all while we do the work for you!
            </p>
          </div>
        </div>

        {/* IMAGE HALF IN / HALF OUT */}
        <div className="overflow-hidden w-full -mt-24 md:-mt-50 flex justify-center">
    <iframe
      ref={serviceMapRef}
      className="w-full max-w-[1247px] h-[300px] md:h-[600px] rounded-4xl opacity-0 translate-y-[120px] will-change-transform"
      src="https://maps.google.com/maps?q=Chicago&t=&z=11&ie=UTF8&iwloc=&output=embed"
      loading="lazy"
    ></iframe>
  </div>
      </section>

      <section className="w-full bg-[#F0FBFF] py-40 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1500px] px-4">
          <div className="relative flex flex-col items-center text-center">
            <div
              ref={circleRef}
              className="absolute w-[850px] h-[850px] bg-[#DAF5FF] rounded-full top-[-40px] z-0 overflow-hidden lg:block md:block hidden"
            />
            <div
              ref={textWrapRef}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <p className="text-secound font-architect mb-2 lg:text-[24px] text-sm">
                Woman-owned business
              </p>
              <h2 className="text-3xl md:text-[50px] font-bold text-primary font-archivo leading-tight">
                ICE CREAM TRUCKS AND CARTS SERVING CORPORATE EVENTS OF ALL SIZES
              </h2>
              <p className="mt-4 text-primary text-[16px] lg:max-w-[756px] font-archivo">
                Windy City Ice Cream is proudly based...
              </p>
              <button
                className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer mt-3"
                ref={s5BtnRef}
              >
                <span className="relative z-10">Reach out</span>
                <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 cursor-pointer"></span>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="mt-16 overflow-hidden whitespace-nowrap relative z-20"
          >
            <div className="flex gap-4 w-max">
              {[...images, ...images].map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt=""
                  width={250}
                  height={300}
                  className="w-62.5 h-75 object-cover rounded-xl shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* last section */}
      <section className="w-full bg-white py-30 flex justify-center">
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
            src="/ices/kem8.webp"
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
