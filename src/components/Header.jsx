"use client";
import Image from "next/image";
// import "./globals.css";
// import About from "../app/About.jsx";
import Link from "next/link";
import { useState } from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navInnerRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef(null);
  const btnsRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(navInnerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          logoRef.current,
          {
            x: -30,
            opacity: 0,
            duration: 0.7,
          },
          "<",
        ) // 👈 same time
        .from(
          navLinksRef.current?.children || [],
          {
            y: -20,
            opacity: 0,
            stagger: 0,
            duration: 0.7,
          },
          "<",
        ) // 👈 same time
        .from(
          hamburgerRef.current,
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.7,
          },
          "<",
        ); // 👈 same time
    });

    return () => ctx.revert();
  }, []);

    const pathname = usePathname();

  function getLinkClass(href) {
    const isActive = pathname === href;
    if (!isActive) return "text-[#00334E]";
    return href === "/" ? "text-[#FFA7E5] font-semibold" : "text-[#0072B0] font-semibold";
  }

  return (
    <header className="w-full px-4 mt-4">
      <div
        className="flex items-center justify-between max-w-375 mx-auto bg-white backdrop-blur-md rounded-full px-12 py-3"
        ref={navInnerRef}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2" ref={logoRef}>
          <Image
            src="/logo.png"
            alt="logo"
            width={108}
            height={80}
            className="w-12.5 sm:w-22.5 lg:w-27 h-auto"
          />
        </div>

        {/* DESKTOP MENU */}
       <nav
  className="hidden md:flex gap-6 text-sm font-medium font-archivo lg:text-[16px]"
  ref={navLinksRef}
>
  <Link href="/"        className={`nav-link ${getLinkClass("/")}`}>Home</Link>
  <Link href="/about"   className={`nav-link ${getLinkClass("/about")}`}>About</Link>
  <Link href="/service" className={`nav-link ${getLinkClass("/service")}`}>Service Area</Link>
  <Link href="/events"  className={`nav-link ${getLinkClass("/events")}`}>Corporate events</Link>
  <Link href="/contact" className={`nav-link ${getLinkClass("/contact")}`}>Contact</Link>
</nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1"
          ref={hamburgerRef}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
  <div className="md:hidden max-w-375 mx-auto mt-2 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 font-archivo">
    <Link href="/"        className={`nav-link ${getLinkClass("/")}`}>Home</Link>
    <Link href="/about"   className={`nav-link ${getLinkClass("/about")}`}>About</Link>
    <Link href="/service" className={`nav-link ${getLinkClass("/service")}`}>Service Area</Link>
    <Link href="/events"  className={`nav-link ${getLinkClass("/events")}`}>Corporate events</Link>
    <Link href="/contact" className={`nav-link ${getLinkClass("/contact")}`}>Contact</Link>
  </div>
)}
    </header>
  );
}
