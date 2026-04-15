"use client";

import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./globals.css";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  {
    bg: "#FFA7E5",
    img: "/1211991 2.png",
    tops: ["/s1.png", "/s1.png", "/s1.png", "/s1.png", "/s1.png", "/s1.png"],
  },
  {
    bg: "#f7c948",
    img: "/1211960 1.png",
    tops: ["/m1.png", "/m1.png", "/m1.png", "/m1.png", "/m1.png", "/m1.png"],
  },
  {
    bg: "#52c8f0",
    img: "/1211047 1.png",
    tops: ["/s1.png", "/s1.png", "/s1.png", "/s1.png", "/s1.png", "/s1.png"],
  },
];

const TPOS = [
  { ex: "-140px", ey: "-160px", er: "15deg" },
  { ex: "140px", ey: "-220px", er: "-20deg" },
  { ex: "-180px", ey: "0px", er: "10deg" },
  { ex: "180px", ey: "0px", er: "-12deg" },
  { ex: "-150px", ey: "150px", er: "28deg" },
  { ex: "100px", ey: "150px", er: "-18deg" },
];

export default function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;
    const scroll = () => {
      if (!container) return;
      scrollAmount += 0.5;
      container.scrollLeft = scrollAmount;
      if (scrollAmount >= container.scrollWidth / 2) scrollAmount = 0;
    };
    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
    "/image4.png",
    "/image5.png",
  ];

  const [cur, setCur] = useState(0);
  const [busy, setBusy] = useState(false);
  const [bg, setBg] = useState("#FFA7E5");
  const [img, setImg] = useState(FLAVORS[0].img);
  const [toppings, setToppings] = useState([]);
  const [animState, setAnimState] = useState("idle");
  const [isInitialized, setIsInitialized] = useState(false);
  const bgRevealRef = useRef(null);

  function spawn(idx) {
    const next = FLAVORS[idx].tops.map((src, i) => ({
      src,
      pos: TPOS[i],
      state: "hidden",
      delay: i * 80,
    }));
    setToppings(next);
    next.forEach((_, i) => {
      setTimeout(() => {
        setToppings((p) =>
          p.map((t, j) => (j === i ? { ...t, state: "emerging" } : t)),
        );
      }, next[i].delay);
    });
  }

  function clearToppings() {
    return new Promise((res) => {
      setToppings((p) => p.map((t) => ({ ...t, state: "hide" })));
      setTimeout(res, 150);
    });
  }

  async function select(idx) {
    if (busy || cur === idx) return;
    setBusy(true);

    // Step 1: Img out + toppings clear - sathe
    setAnimState("closing");
    clearToppings();

    // Step 2: Img out puri thay tyare circle start thay
    await new Promise((r) => setTimeout(r, 300));

    // Step 3: BG circle expand shuru
    if (bgRevealRef.current) {
      bgRevealRef.current.style.background = FLAVORS[idx].bg;
      bgRevealRef.current.style.animation = "none";
      bgRevealRef.current.offsetHeight;
      bgRevealRef.current.style.animation =
        "bgCircleUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards";
    }

    // Step 4: Circle expand thay tyare (half way) - bg + img update
    await new Promise((r) => setTimeout(r, 100));

    setBg(FLAVORS[idx].bg);
    setCur(idx);
    setImg(FLAVORS[idx].img);

    // Step 5: Img in animation
    setAnimState("opening");
    spawn(idx);

    // Step 6: Circle animation complete thay pachhi reset
    setTimeout(() => {
      setAnimState("idle");
      setBusy(false);
      if (bgRevealRef.current) {
        bgRevealRef.current.style.animation = "none";
        bgRevealRef.current.style.clipPath = "circle(0% at 50% 50%)";
      }
    }, 700);
  }

  function getToppingStyle(t) {
    const base = {
      position: "absolute",
      left: "45%",
      top: "30%",
      pointerEvents: "none",
      zIndex: 15,
      transformOrigin: "center",
      marginLeft: "-11px",
      marginTop: "-11px",
      transition: "all .4s ease",
      ["--ex"]: t.pos?.ex || "0px",
      ["--ey"]: t.pos?.ey || "0px",
      ["--er"]: t.pos?.er || "0deg",
    };
    if (t.state === "hidden")
      return {
        ...base,
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0)",
      };
    if (t.state === "emerging")
      return {
        ...base,
        opacity: 0,
        animation: `toppingEmerge 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${t.delay}ms forwards`,
      };
    if (t.state === "visible" || t.state === "show")
      return {
        ...base,
        opacity: 1,
        transform: `translate(-50%, -50%) translate(${t.pos.ex}, ${t.pos.ey}) scale(1) rotate(${t.pos.er})`,
      };
    if (t.state === "retreating")
      return {
        ...base,
        opacity: 1,
        transform: `translate(-50%, -50%) translate(${t.pos.ex}, ${t.pos.ey}) scale(1) rotate(${t.pos.er})`,
        animation: `toppingRetreat 0.4s cubic-bezier(0.5, 0, 0.75, 0) ${t.delay}ms forwards`,
      };
    return base;
  }

  /* topping float refs */
  const refs = useRef([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.to(el, {
          y: -12,
          duration: 1.2 + (i % 3) * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, [toppings]);

  /* ── HERO entry animation ── */
  const heroSubtitleRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroBtnAboutRef = useRef(null);
  const heroBtnReachRef = useRef(null);
  const heroCircleRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroLeftSelectorsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pehla HIDE karo - render thay tyaj invisible rahse
      gsap.set([heroBtnAboutRef.current, heroBtnReachRef.current], {
        opacity: 0,
        x: 80,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroSubtitleRef.current, { y: -40, opacity: 0, duration: 0.7 })
        .from(
          heroTitleRef.current,
          { y: -60, opacity: 0, duration: 0.8 },
          "-=0.4",
        )
        .from(
          heroCircleRef.current,
          { scale: 0, opacity: 0, duration: 0.9, ease: "back.out(1.7)" },
          "-=0.5",
        )
        .from(
          heroImgRef.current,
          { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.4)" },
          "-=0.6",
        )
        .from(
          heroLeftSelectorsRef.current,
          { x: -80, opacity: 0, duration: 0.7 },
          "-=0.5",
        )
        // Buttons - from() ni jagya to() use karo
        .to(
          heroBtnAboutRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          heroBtnReachRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35",
        );
    });

    return () => ctx.revert();
  }, []);

  /* center image float */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroImgRef.current, {
        y: -18,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  /* Initialize first flavor with toppings */
  useEffect(() => {
    if (!isInitialized) {
      setTimeout(() => {
        spawn(0);
        setIsInitialized(true);
      }, 1500);
    }
  }, [isInitialized]);

  /* second section */
  const leftImg = useRef(null);
  const rightImg = useRef(null);
  const contentRef = useRef(null);
  const triangleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left img - left thi slide in
      gsap.from(leftImg.current, {
        x: -150,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: leftImg.current, start: "top 90%" },
      });

      // Triangle - top thi neeche aavse
      gsap.from(triangleRef.current, {
        scrollTrigger: { trigger: triangleRef.current, start: "top 80%" },
        y: -120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Right img - right thi slide in
      gsap.from(rightImg.current, {
        x: 150,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: rightImg.current, start: "top 90%" },
      });

      // Upar-neeche float - as it is
      [leftImg.current, rightImg.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -20,
          duration: 2 + i * 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Content - top thi neeche (triangle + text)
      gsap.from(contentRef.current.children, {
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
        y: 60, // 👈 80 → -60 matlab upar thi neeche aavse
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  /* fourth section */
  const leftRef = useRef(null);
  const mapRef = useRef(null);
  const s4ParaRef = useRef(null); // "We come to you"
  const s4HeadRef = useRef(null); // Heading
  const s4TxtRef = useRef(null); // Paragraph
  const s4BtnRef = useRef(null); // Button

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: leftRef.current, start: "top 80%" };

      // "We come to you" - left thi
      gsap.from(s4ParaRef.current, {
        scrollTrigger: trigger,
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Heading - left thi, thoda delay sathe
      gsap.from(s4HeadRef.current, {
        scrollTrigger: trigger,
        x: -80,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
      });

      // Paragraph text - left thi
      gsap.from(s4TxtRef.current, {
        scrollTrigger: trigger,
        x: -60,
        opacity: 0,
        duration: 0.8,
        delay: 0.28,
        ease: "power3.out",
      });

      // Button - neeche thi aave, scale sathe
      gsap.fromTo(
        s4BtnRef.current,
        { y: 30, opacity: 0, scale: 0.85 },
        {
          scrollTrigger: trigger,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.42,
          ease: "back.out(1.7)",
        },
      );

      // Map - right thi slide in
      gsap.from(mapRef.current, {
        scrollTrigger: { trigger: mapRef.current, start: "top 85%" },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  /* fifth section */
  const textWrapRef = useRef(null);
  const circleRef = useRef(null);
  const s5BtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: textWrapRef.current, start: "top 80%" };

      // Circle - scale thi aave
      gsap.fromTo(
        circleRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: circleRef.current, start: "top 85%" },
        },
      );

      // "Woman-owned business" - p tag
      gsap.from(textWrapRef.current.children[0], {
        scrollTrigger: trigger,
        y: -40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      // Heading - h2
      gsap.from(textWrapRef.current.children[1], {
        scrollTrigger: trigger,
        y: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.12,
        ease: "power3.out",
      });

      // Paragraph
      gsap.from(textWrapRef.current.children[2], {
        scrollTrigger: trigger,
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: 0.24,
        ease: "power3.out",
      });

      // Button - alag set + to sathe
      gsap.set(s5BtnRef.current, { opacity: 0, y: 30, scale: 0.85 });
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
      gsap.from(items[0], {
        y: -80,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(items[1], {
        x: -120,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(items[2], {
        y: 80,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(leftImgRef.current, {
        x: -200,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(rightImgRef.current, {
        x: 200,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      [leftImgRef.current, rightImgRef.current].forEach((el, i) => {
        gsap.to(el, {
          y: -20,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes irisOpen { from { clip-path: circle(0% at 50% 85%); } to { clip-path: circle(150% at 50% 85%); } }
        @keyframes toppingEmerge {
          0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
          100% { opacity: 1; transform: translate(var(--ex),var(--ey)) scale(1) rotate(var(--er)); }
        }
        @keyframes toppingRetreat {
          0%   { opacity: 1; transform: translate(var(--ex),var(--ey)) scale(1) rotate(var(--er)); }
          100% { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
        }
        @keyframes lotusOpen  { 0% { clip-path: ellipse(0% 0% at 50% 100%); } 100% { clip-path: ellipse(120% 120% at 50% 0%); } }
        @keyframes lotusClose { 0% { clip-path: ellipse(120% 120% at 50% 0%); } 100% { clip-path: ellipse(0% 0% at 50% 100%); } }
        @keyframes imgOut { 
  0%   { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); } 
  100% { transform: translateY(40px) scale(0.88); opacity: 0; filter: blur(3px); } 
}
@keyframes imgIn  { 
  0%   { transform: translateY(-40px) scale(0.88); opacity: 0; filter: blur(3px); } 
  100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); } 
}
        @keyframes bgReveal { 0% { clip-path: ellipse(0% 0% at 50% 100%); } 100% { clip-path: ellipse(160% 160% at 50% 0%); } }
        @keyframes bgCircleUp {
  0%   { clip-path: circle(0% at 50% 50%); }
  100% { clip-path: circle(150% at 50% 50%); }
}
      @keyframes bgPageLoad {
  0%   { clip-path: ellipse(0% 0% at 50% 0%); }
  100% { clip-path: ellipse(200% 200% at 50% 0%); }
}
      @keyframes rainFall {
  0%   { transform: translateY(-80px) rotate(var(--r0)) translateX(0px); opacity: 0; }
  5%   { opacity: var(--op); }
  90%  { opacity: var(--op); }
  100% { transform: translateY(110vh) rotate(var(--r1)) translateX(var(--sway)); opacity: 0; }
}
      `}</style>

      <main className="relative overflow-hidden lg:min-h-screen h-120">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <filter id="remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              7 7 7 0 -0.3
            " />
          </filter>
        </svg>
        
        {/* ── Cốm rain particles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
          {[
            { src: "/s1.png",    left:  3, dur: 4.2, delay: 0.0, size: 28, op: 0.75, r0: "-10deg", r1:  "25deg", sway:  "18px" },
            { src: "/m1.png",    left:  9, dur: 5.8, delay: 0.6, size: 22, op: 0.65, r0:  "15deg", r1: "-20deg", sway: "-14px" },
            { src: "/cendy1.png",left: 15, dur: 3.9, delay: 1.2, size: 20, op: 0.80, r0:  "-5deg", r1:  "30deg", sway:  "22px" },
            { src: "/s1.png",    left: 22, dur: 6.1, delay: 0.3, size: 26, op: 0.70, r0:  "20deg", r1: "-15deg", sway: "-20px" },
            { src: "/cendy2.png",left: 28, dur: 4.5, delay: 1.8, size: 18, op: 0.85, r0: "-18deg", r1:  "35deg", sway:  "16px" },
            { src: "/m1.png",    left: 34, dur: 5.2, delay: 0.9, size: 24, op: 0.60, r0:  "12deg", r1: "-25deg", sway: "-18px" },
            { src: "/cendy3.png",left: 40, dur: 3.7, delay: 2.1, size: 22, op: 0.75, r0:  "-8deg", r1:  "20deg", sway:  "24px" },
            { src: "/s1.png",    left: 46, dur: 6.4, delay: 0.4, size: 30, op: 0.65, r0:  "25deg", r1: "-30deg", sway: "-12px" },
            { src: "/cendy1.png",left: 52, dur: 4.0, delay: 1.5, size: 20, op: 0.80, r0: "-15deg", r1:  "18deg", sway:  "20px" },
            { src: "/m1.png",    left: 58, dur: 5.5, delay: 0.7, size: 26, op: 0.70, r0:  "10deg", r1: "-22deg", sway: "-16px" },
            { src: "/cendy2.png",left: 64, dur: 3.8, delay: 2.4, size: 18, op: 0.85, r0: "-20deg", r1:  "28deg", sway:  "14px" },
            { src: "/s1.png",    left: 70, dur: 6.0, delay: 1.0, size: 24, op: 0.60, r0:  "18deg", r1: "-12deg", sway: "-22px" },
            { src: "/cendy3.png",left: 76, dur: 4.3, delay: 0.2, size: 22, op: 0.75, r0:  "-6deg", r1:  "32deg", sway:  "18px" },
            { src: "/m1.png",    left: 82, dur: 5.0, delay: 1.7, size: 28, op: 0.65, r0:  "22deg", r1: "-18deg", sway: "-20px" },
            { src: "/cendy1.png",left: 88, dur: 3.6, delay: 2.8, size: 20, op: 0.80, r0: "-12deg", r1:  "22deg", sway:  "26px" },
            { src: "/s1.png",    left: 94, dur: 6.3, delay: 0.5, size: 26, op: 0.70, r0:  "16deg", r1: "-26deg", sway: "-10px" },
            { src: "/cendy2.png",left:  6, dur: 4.8, delay: 3.2, size: 18, op: 0.85, r0: "-22deg", r1:  "15deg", sway:  "20px" },
            { src: "/m1.png",    left: 13, dur: 5.6, delay: 1.4, size: 24, op: 0.60, r0:  "14deg", r1: "-28deg", sway: "-14px" },
            { src: "/s1.png",    left: 19, dur: 3.5, delay: 2.6, size: 30, op: 0.75, r0:  "-9deg", r1:  "36deg", sway:  "22px" },
            { src: "/cendy3.png",left: 25, dur: 5.9, delay: 0.8, size: 22, op: 0.65, r0:  "28deg", r1: "-16deg", sway: "-18px" },
            { src: "/cendy1.png",left: 31, dur: 4.1, delay: 1.9, size: 20, op: 0.80, r0: "-16deg", r1:  "24deg", sway:  "16px" },
            { src: "/m1.png",    left: 37, dur: 6.2, delay: 3.5, size: 26, op: 0.70, r0:  "11deg", r1: "-20deg", sway: "-24px" },
            { src: "/s1.png",    left: 43, dur: 3.9, delay: 0.1, size: 24, op: 0.60, r0: "-24deg", r1:  "30deg", sway:  "12px" },
            { src: "/cendy2.png",left: 49, dur: 5.3, delay: 2.2, size: 18, op: 0.85, r0:  "19deg", r1: "-14deg", sway: "-16px" },
            { src: "/cendy3.png",left: 55, dur: 4.7, delay: 1.1, size: 22, op: 0.75, r0:  "-7deg", r1:  "26deg", sway:  "20px" },
            { src: "/m1.png",    left: 61, dur: 6.5, delay: 3.0, size: 28, op: 0.65, r0:  "23deg", r1: "-32deg", sway: "-22px" },
            { src: "/s1.png",    left: 67, dur: 4.4, delay: 0.9, size: 26, op: 0.70, r0: "-13deg", r1:  "18deg", sway:  "14px" },
            { src: "/cendy1.png",left: 73, dur: 5.1, delay: 2.5, size: 20, op: 0.80, r0:  "17deg", r1: "-24deg", sway: "-12px" },
            { src: "/s1.png",    left: 79, dur: 3.7, delay: 1.3, size: 24, op: 0.60, r0: "-21deg", r1:  "34deg", sway:  "26px" },
            { src: "/cendy2.png",left: 85, dur: 5.7, delay: 2.9, size: 18, op: 0.85, r0:  "26deg", r1: "-10deg", sway: "-20px" },
            { src: "/m1.png",    left: 91, dur: 4.6, delay: 0.3, size: 22, op: 0.75, r0: "-11deg", r1:  "22deg", sway:  "18px" },
          ].map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt=""
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: "-60px",
                width: p.size,
                height: p.size,
                objectFit: "contain",
                animation: `rainFall ${p.dur}s linear ${p.delay}s infinite`,
                "--r0": p.r0,
                "--r1": p.r1,
                "--sway": p.sway,
                "--op": p.op,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
        {/* Main bg - page load circle reveal neeche thi */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: bg,
            animation: "bgPageLoad 4s cubic-bezier(0.22,1,0.36,1) forwards", // 1.1s → 1.6s
          }}
        />
        {/* Flavor change overlay - neeche thi circle expand */}
        <div
          ref={bgRevealRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: -9,
            clipPath: "ellipse(0% 0% at 50% 100%)",
          }}
        />

        <Header />

        <section className="text-center mt-6 md:mt-10 px-4 max-w-6xl mx-auto">
          <p
            ref={heroSubtitleRef}
            className="text-sm md:text-[24px] text-secound font-architect"
          >
            Welcome to Windy City Ice Cream
          </p>

          <h1
            ref={heroTitleRef}
            className="title text-2xl sm:text-3xl md:text-5xl lg:text-[70px] font-bold mt-4 text-primary relative z-10 font-archivo"
          >
            CHICAGO&apos;S PREMIUM <br /> ICE CREAM TRUCKS
          </h1>

          <div className="relative flex justify-center items-center mt-10 md:mt-16">
            <div
              ref={heroCircleRef}
              className="absolute w-65 h-65 sm:w-[320px] sm:h-80 md:w-175 md:h-175 lg:w-233.75 lg:h-200 bg-[#FFFFFF33] rounded-full"
            ></div>

            {/* left flavor selectors */}
            <div
              ref={heroLeftSelectorsRef}
              className="absolute left-5 sm:left-4 md:left-6 lg:left-18 flex flex-col gap-2 md:gap-8 z-10"
            >
              {/* Flavor 0 */}
              <div
                onClick={() => select(0)}
                className="lg:-ml-2 -ml-2 rounded-full cursor-pointer flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1"
              >
                <div
                  className={`rounded-full transition-all duration-500 flex items-center justify-center
        ${
          cur === 0
            ? "border-2 border-white p-2.5"
            : "border-[3px] border-transparent p-2"
        }`}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#FFFFFF33] overflow-hidden">
                    <Image
                      src={FLAVORS[0].img}
                      alt="flavor"
                      width={48}
                      height={48}
                      className="w-6 sm:w-9 md:w-12 object-contain transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Flavor 1 */}
              <div
                onClick={() => select(1)}
                className="lg:-ml-10 -ml-8 rounded-full cursor-pointer flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1"
              >
                <div
                  className={`rounded-full transition-all duration-500 flex items-center justify-center
        ${
          cur === 1
            ? "border-2 border-white p-2.5"
            : "border-[3px] border-transparent p-2"
        }`}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-white overflow-hidden">
                    <Image
                      src={FLAVORS[1].img}
                      alt="flavor"
                      width={48}
                      height={48}
                      className="w-6 sm:w-9 md:w-12 object-contain transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Flavor 2 */}
              <div
                onClick={() => select(2)}
                className="lg:ml-1 ml-3 rounded-full cursor-pointer flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1"
              >
                <div
                  className={`rounded-full transition-all duration-500 flex items-center justify-center
        ${
          cur === 2
            ? "border-2 border-white p-2.5"
            : "border-[3px] border-transparent p-2"
        }`}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-white overflow-hidden">
                    <Image
                      src={FLAVORS[2].img}
                      alt="flavor"
                      width={48}
                      height={48}
                      className="w-6 sm:w-9 md:w-12 object-contain transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* center ice cream */}
            <div
              className="rounded-full relative flex items-center justify-center w-37.5 h-37.5 sm:w-65 sm:h-65 md:w-100 md:h-100 lg:w-125 lg:h-125"
              style={{ background: bg }}
            >
              <video
                ref={heroImgRef}
                src="/animation.webm"
                autoPlay
                muted
                playsInline
                className="z-10 w-[240px] sm:w-[320px] md:w-[480px] lg:w-[600px] h-auto lg:mb-20 object-contain"
                style={{
                  animation:
                    animState === "closing"
                      ? "imgOut 0.5s cubic-bezier(0.4,0,1,1) forwards"
                      : animState === "opening"
                        ? "imgIn 0.75s cubic-bezier(0,0,0.2,1) forwards"
                        : "none",
                  willChange: "transform, opacity, filter",
                }}
              />

              {toppings.map((t, i) => (
                <span key={i} style={getToppingStyle(t)}>
                  <Image
                    ref={(el) => (refs.current[i] = el)}
                    src={t.src}
                    alt="icon"
                    width={80}
                    height={80}
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 object-contain"
                  />
                </span>
              ))}
            </div>

            {/* right buttons */}
            <div className="absolute top-40 lg:top-40 right-35 sm:right-4 md:right-6 lg:right-12 flex flex-col gap-2 md:gap-4 z-20">
              <Link
  href="/about"
  ref={heroBtnAboutRef}
  className="bg-[#00334E] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-l-full rounded-r-md text-xs md:text-[16px] about-btn cursor-pointer inline-block"
>
  About Us
</Link>

<Link
  href="/contact"
  ref={heroBtnReachRef}
  className="bg-[#0072B0] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-l-full rounded-r-md text-xs md:text-[16px] reach-btn cursor-pointer inline-block"
>
  <span>Reach out</span>
</Link>
            </div>

          </div>
        </section>
      </main>

      {/* second section */}
      <div className="w-full overflow-hidden">
        <section className="relative w-full flex items-center justify-center py-16 md:py-24 lg:py-28 bg-white">
          <Image
            ref={leftImg}
            src="/biskit.png"
            alt="biskit"
            width={320}
            height={320}
            className="absolute lg:left-0 lg:top-1/2 left-0 top-80 -translate-y-1/2 h-32.5 md:h-65 lg:h-80 w-auto object-contain"
          />

          <Image
            ref={rightImg}
            src="/cookie.png"
            alt="cookie"
            width={320}
            height={320}
            className="absolute lg:right-0 lg:top-1/2 right-0 top-80 -translate-y-1/2 h-25 md:h-65 lg:h-80 w-auto object-contain"
          />

          <div
            ref={contentRef}
            className="relative text-center lg:max-w-250 px-4 z-10"
          >
            <div className="absolute inset-0 flex justify-center items-center -z-10">
              <div
                className="w-0 h-0 border-l-[160px] border-r-[160px] border-t-[260px] border-l-transparent border-r-transparent border-t-[#DAF5FF80] md:border-l-[700px] md:border-r-[700px] md:border-t-[820px] lg:mb-70"
                ref={triangleRef}
              ></div>
            </div>
            <p className="text-xs md:text-[24px] text-secound font-architect mb-2">
              Nostalgia in Every Bite, Bringing Frozen Treats to You
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-[70px] font-bold text-primary font-archivo mb-4">
              THE ICE CREAM TRUCK EXPERIENCE
            </h1>
            <p className="text-xs md:text-[22px] text-primary font-archivo mb-6">
              Windy City Ice Cream services Chicago and the surrounding suburbs
              with a great ice cream truck experience. If you are looking for a
              fun and unique idea to try at your next gathering...
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/about" className="bg-[#00334E] text-white px-4 py-2 text-sm md:text-[16px] btn2 rounded-r-md rounded-l-full relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer inline-block">
                <span className="relative z-10">About Us</span>
                <span className="absolute inset-0 bg-[#005b73] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              </Link>

              <Link href="/contact" className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer inline-block">
                <span className="relative z-10">Reach out</span>
                <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full z-10 lg:mb-15 mb-10">
          <div className="bg-[#00334E] whitespace-nowrap overflow-hidden py-3 lg:-skew-y-3 z-10 lg:mb-0 mb-2">
            <div className="marquee flex gap-20 lg:text-[24px] text-[15px] font-archivo text-white">
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
            </div>
          </div>

          <div className="bg-[#00334E] whitespace-nowrap overflow-hidden py-3 lg:skew-y-3 lg:-mt-14 mt-1 z-10">
            <div className="marquee2 flex gap-14 lg:text-[24px] text-[15px] font-archivo text-white">
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            animation: scroll 15s linear infinite;
          }
          .marquee2 {
            display: flex;
            width: max-content;
            animation: scroll2 15s linear infinite;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes scroll2 {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
        `}</style>
      </div>

      {/* image scroll strip */}
      <div className="overflow-hidden w-full mt-10">
        <div className="flex gap-2 animate-scroll w-max hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, i) => (
            <Image
              key={i}
              src={`/image${item}.png`}
              alt="Ice cream truck event"
              width={267}
              height={300}
              className="w-66.75 h-75 object-cover rounded-xl shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Signature Product Showcase */}
      <section className="relative w-full min-h-[600px] md:aspect-video overflow-hidden bg-[#FFF5F9]">
        <video
          key="signature-bg"
          src="/Ice_Cream_Video_oAKc4_h7.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 z-10 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm md:text-[20px] text-secound font-architect mb-2 drop-shadow-sm">Our signature treat</p>
          <h2 className="text-3xl md:text-5xl lg:text-[64px] font-bold text-primary font-archivo leading-tight mb-4 drop-shadow-md">
            STRAWBERRY<br />ON A STICK
          </h2>
          <p className="text-sm md:text-[18px] text-primary font-archivo mb-8 max-w-2xl drop-shadow-md bg-white/40 backdrop-blur-md rounded-2xl p-4">
            One iconic frozen treat, served with a smile. Our strawberry ice
            cream bar is the crowd favorite at every event we roll up to.
          </p>
        </div>
      </section>

      {/* fourth section - map */}
      <section className="w-full bg-[#F0FBFF] py-12 md:py-16 lg:py-20 pl-4">
        <div
          ref={leftRef}
          className="mx-auto flex flex-col lg:flex-row items-center"
        >
          <div className="w-full lg:w-1/2 lg:ml-30">
            <p
              ref={s4ParaRef}
              className="text-secound text-sm lg:text-[24px] mb-2 font-architect"
            >
              We come to you
            </p>

            <h2
              ref={s4HeadRef}
              className="text-2xl md:text-[47px] font-bold text-primary font-archivo mb-4 leading-tight lg:max-w-[607px]"
            >
              WE SERVE CHICAGO AND SOME SURROUNDING SUBURBS
            </h2>

            <p
              ref={s4TxtRef}
              className="text-sm md:text-[16px] text-primary mb-6 max-w-md font-archivo"
            >
              With our unique fleet of ice cream trucks...
            </p>

            <Link
              href="/contact"
              ref={s4BtnRef}
              className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer inline-block"
            >
              <span className="relative z-10">Reach out</span>
              <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 lg:pr-0">
            <div
              ref={mapRef}
              className="w-full h-75 md:h-100 lg:h-125 overflow-hidden rounded-l-[35px]"
            >
              <iframe
                className="w-full h-full"
                src="https://maps.google.com/maps?q=Chicago&t=&z=11&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* fifth section */}
      <section className="w-full bg-[#F0FBFF] py-16 flex justify-center overflow-hidden">
        <div className="w-full max-w-375 px-4">
          <div className="relative flex flex-col items-center text-center">
            <div
              ref={circleRef}
              className="absolute w-212.5 h-212.5 bg-[#DAF5FF] rounded-full -top-15 z-0 overflow-hidden lg:block md:block hidden"
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
              <p className="mt-4 text-primary text-[16px] lg:max-w-189 font-archivo">
                Windy City Ice Cream is proudly based...
              </p>
              <Link
                href="/contact"
                className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer mt-3 inline-block"
                ref={s5BtnRef}
              >
                <span className="relative z-10">Reach out</span>
                <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
              </Link>
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
                  alt="Ice cream service event"
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
            alt="Candy decoration"
            width={200}
            height={200}
            className="hidden md:block absolute left-0 bottom-0 w-30 md:w-40 lg:w-50 h-auto"
          />
          <Image
            ref={rightImgRef}
            src="/icecon.png"
            alt="Ice cream cone decoration"
            width={220}
            height={220}
            className="hidden md:block absolute right-0 bottom-0 w-30 md:w-45 lg:w-55 h-auto"
          />

          <div ref={wrapRef} className="text-center lg:max-w-210.5 z-10">
            <h2 className="text-2xl md:text-4xl lg:text-[50px] font-bold text-primary font-archivo leading-tight">
              READY TO BRING AN ICE CREAM TRUCK TO YOUR EVENT?
            </h2>
            <p className="mt-4 text-primary text-sm md:text-[22px]">
              With hundreds of satisfied customers all over Chicago...
            </p>
            <Link href="/contact" className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer mt-3 inline-block">
              <span className="relative z-10">Reach out</span>
              <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </>
  );
}

