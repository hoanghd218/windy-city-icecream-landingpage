"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navInnerRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          { x: -30, opacity: 0, duration: 0.7 },
          "<",
        )
        .from(
          navLinksRef.current?.children || [],
          { y: -20, opacity: 0, stagger: 0, duration: 0.7 },
          "<",
        )
        .from(
          hamburgerRef.current,
          { opacity: 0, scale: 0.7, duration: 0.7 },
          "<",
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.25, ease: "power2.out" },
      );
    }
  }, [menuOpen]);

  const pathname = usePathname();

  function getLinkClass(href) {
    const isActive = pathname === href;
    if (!isActive) return "text-[#00334E]";
    return href === "/" ? "text-[#FFA7E5] font-semibold" : "text-[#0072B0] font-semibold";
  }

  return (
    <header className="w-full px-4 mt-4 sticky top-0 z-50">
      <div
        className={`flex items-center justify-between max-w-375 mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 sm:px-12 py-3 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""}`}
        ref={navInnerRef}
      >
        <Link href="/" className="flex items-center gap-2" ref={logoRef}>
          <Image
            src="/logo.png"
            alt="Windy City Ice Cream logo"
            width={108}
            height={80}
            className="w-12.5 sm:w-22.5 lg:w-27 h-auto"
          />
        </Link>

        <nav
          className="hidden md:flex gap-6 text-sm font-medium font-archivo lg:text-[16px]"
          ref={navLinksRef}
        >
          <Link href="/" className={`nav-link ${getLinkClass("/")}`}>Home</Link>
          <Link href="/about" className={`nav-link ${getLinkClass("/about")}`}>About</Link>
          <Link href="/service" className={`nav-link ${getLinkClass("/service")}`}>Service Area</Link>
          <Link href="/events" className={`nav-link ${getLinkClass("/events")}`}>Corporate events</Link>
          <Link href="/contact" className={`nav-link ${getLinkClass("/contact")}`}>Contact</Link>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
          ref={hamburgerRef}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`w-6 h-0.5 bg-[#00334E] rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#00334E] rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-[#00334E] rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          ref={mobileMenuRef}
          className="md:hidden max-w-375 mx-auto mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-5 flex flex-col gap-4 font-archivo origin-top"
        >
          <Link href="/" onClick={() => setMenuOpen(false)} className={`nav-link text-base ${getLinkClass("/")}`}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className={`nav-link text-base ${getLinkClass("/about")}`}>About</Link>
          <Link href="/service" onClick={() => setMenuOpen(false)} className={`nav-link text-base ${getLinkClass("/service")}`}>Service Area</Link>
          <Link href="/events" onClick={() => setMenuOpen(false)} className={`nav-link text-base ${getLinkClass("/events")}`}>Corporate events</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className={`nav-link text-base ${getLinkClass("/contact")}`}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
