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
              <a
                href="https://www.facebook.com/windycityicecream"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-14 h-14 md:w-18 md:h-18 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-14 h-14 md:w-18 md:h-18 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="mailto:windycityicecream@gmail.com"
                aria-label="Email"
                className="w-14 h-14 md:w-18 md:h-18 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#00334E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
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
  alt="Windy City Ice Cream logo"
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
            ©Windy City Ice Cream {new Date().getFullYear()} - All rights reserved
          </p>
        </div>

        {/* ✅ Badge image → /pricing page par navigate karse */}
        <div className="w-full flex justify-center md:justify-end cursor-pointer">
          <Link href="/pricing" className="inline-block">
            <Image
  src="/badge.png"
  alt="View pricing and services"
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
