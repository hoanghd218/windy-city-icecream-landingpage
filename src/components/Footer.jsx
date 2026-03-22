"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const outerBgRef = useRef(null);
  const circleWrapRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Step 1: Outer bg - square inset thi center mathi open thase
      gsap.fromTo(
        outerBgRef.current,
        { clipPath: "inset(50% 50% 50% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
        },
      );

      // Step 2: Half circle - neeche thi aavse
      gsap.from(circleWrapRef.current, {
        y: -220,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
        scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
      });

      // Step 3: Content items stagger
      const items = contentRef.current.children;
      gsap.from(items[0], {
        y: -50,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.8,
        scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
      });
      gsap.from(items[1], {
        x: -80,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.95,
        scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
      });
      gsap.from(items[2], {
        x: 80,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 1.05,
        scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
      });

      // Step 4: Logo - zoom out (scale 2.2 to 1)
      gsap.fromTo(
        logoRef.current,
        { scale: 2.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
          scrollTrigger: { trigger: outerBgRef.current, start: "top 90%" },
        },
      );

      // Step 5: Bottom 3 - neeche thi upar aavse
      const bottomItems = bottomRef.current.children;
      const btrigger = { trigger: bottomRef.current, start: "top 95%" };
      gsap.from(bottomItems[0], {
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: btrigger,
      });
      gsap.from(bottomItems[1], {
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.12,
        scrollTrigger: btrigger,
      });
      gsap.from(bottomItems[2], {
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.24,
        scrollTrigger: btrigger,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={outerBgRef}
      className="w-full bg-[#F0FBFF] py-16 flex flex-col items-center"
    >
      <div className="relative w-full max-w-5xl flex flex-col items-center">
        <div
          ref={circleWrapRef}
          className="w-full h-100 md:h-125 bg-[#DAF5FF] rounded-b-full flex flex-col items-center justify-start pt-10 -mt-16"
        >
          <div ref={contentRef} className="flex flex-col items-center w-full">
            <div className="flex gap-4 mb-10">
              <div className="w-18.25 h-18.25 bg-[#D9D9D9] rounded-full"></div>
              <div className="w-18.25 h-18.25 bg-[#D9D9D9] rounded-full"></div>
              <div className="w-18.25 h-18.25 bg-[#D9D9D9] rounded-full"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-[16px] text-primary font-archivo mb-10">
               <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/service">Service Area</Link>
          <Link href="/events">Corporate events</Link>
          <Link href="/contact">Contact</Link>
            </div>

            <div className="text-center text-sm md:text-[16px] text-primary font-archivo mb-4 px-4">
              <p>11641 South Ridgeland Ave Unit D</p>
              <p className="mb-3">Alsip, IL, 60803</p>
              <p>windycityicecream@gmail.com</p>
            </div>

            <div ref={logoRef} className="mt-2">
              <Image
  src="/logo.png"
  alt=""
  width={112}
  height={112}
  className="w-24 md:w-28 mx-auto"
/>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={bottomRef}
        className="w-full lg:max-w-375 flex flex-col md:flex-row items-center justify-between mt-10 gap-6 px-4"
      >
        {/* ✅ Refunds text → /refunds page par navigate karse */}
        <div className="w-full text-center md:text-left">
          <Link
            href="/refunds"
            className="text-sm md:text-[16px] text-primary font-archivo cursor-pointer hover:underline"
          >
            Refunds &amp; Returns
          </Link>
        </div>

        <div className="w-full text-center">
          <p className="text-sm md:text-[16px] text-primary font-archivo">
            ©Windy City Ice Cream 2025 - All rights reserved
          </p>
        </div>

        {/* ✅ Badge image → /pricing page par navigate karse */}
        <div className="w-full flex justify-center md:justify-end cursor-pointer">
          <Link href="/pricing" className="inline-block">
            <Image
  src="/badge.png"
  alt="Refunds & Returns"
  width={200}
  height={200}
  className="w-20 md:w-50"
/>
          </Link>
        </div>
      </div>
    </div>
  );
}
