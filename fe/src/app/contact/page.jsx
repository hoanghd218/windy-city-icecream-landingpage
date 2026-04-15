"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";
import Image from "next/image";
import { useRef, Suspense, useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  return (
    <Suspense fallback={null}>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const prefill = {
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    zip: searchParams.get("zip") || "",
    address: searchParams.get("address") || "",
    people: searchParams.get("people") || "",
    interest: searchParams.get("interest") || "",
    hours: searchParams.get("hours") || "",
    total: searchParams.get("total") || "",
  };
  // Pre-built notes so the operator sees the chatbot context
  const noteFromBot = [
    prefill.hours && `Event duration: ${prefill.hours} hour(s)`,
    prefill.total && `Estimated total from chatbot: $${prefill.total}`,
  ]
    .filter(Boolean)
    .join("\n");
  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
    "/image4.png",
    "/image5.png",
  ];

  const scrollRef = useRef(null);

  // // Auto scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;

    const scroll = () => {
      if (!container) return;
      scrollAmount += 0.5;
      container.scrollLeft = scrollAmount;

      // reset for infinite effect
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
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

  /* service section */

  const serviceBgRef = useRef(null);
  const serviceMapRef = useRef(null);
  const serviceTextRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      <section className="relative bg-[#F0FBFF]">
        <div
          ref={serviceBgRef}
          className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-32 md:pb-60"
        >
          <Header />

          <div
            className="max-w-[1000px] mx-auto px-4 text-center mt-10 md:mt-15"
            ref={serviceTextRef}
          >
            <h1 className="text-3xl md:text-[60px] font-bold text-primary font-archivo mb-4 uppercase">
              Contact
            </h1>

            <p className="text-sm md:text-[18px] text-primary font-archivo max-w-[919px] mx-auto font-semobold mb-5">
              For immediate assistance, please call us at (708) 529-8875.
            </p>
          </div>
        </div>

        {/* IMAGE HALF IN / HALF OUT */}
        <div className=" w-full -mt-24 md:-mt-65 flex justify-center">
          <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
            <img
              src="/contact-cendy.png"
              alt="icecream"
              className="absolute lg:-left-15 lg:-top-5 left-0 top-0 w-10 md:w-30"
            />

            <div className="bg-white w-full max-w-5xl rounded-xl shadow-md p-6 md:p-10">
              <ContactForm prefill={prefill} noteFromBot={noteFromBot} />
            </div>
          </div>
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

function ContactForm({ prefill, noteFromBot }) {
  const interestMap = {
    truck: "An ice cream truck",
    pushcart: "An ice cream cart",
  };
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (status.state === "submitting") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      street: fd.get("street"),
      zip: fd.get("zip"),
      people: fd.get("people"),
      date: fd.get("date"),
      time: fd.get("time"),
      interests: fd.getAll("interests"),
      eventType: fd.get("eventType"),
      multipleShifts: fd.get("multipleShifts"),
      specialNotes: fd.get("specialNotes"),
    };
    setStatus({ state: "submitting", message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus({
        state: "success",
        message: "Thank you! We received your inquiry and will call you soon.",
      });
      form.reset();
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  if (status.state === "success") {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl mb-4">
          ✓
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-archivo mb-3">
          Thank you!
        </h2>
        <p className="text-base text-gray-700 max-w-md mx-auto">
          {status.message} We&apos;ll reach out to confirm details shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle", message: "" })}
          className="mt-6 px-5 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="label">
          Name <span className="req">(Required)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" name="firstName" placeholder="First name" defaultValue={prefill.firstName} required />
          <input className="input" name="lastName" placeholder="Last name" defaultValue={prefill.lastName} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            Email <span className="req">(Required)</span>
          </label>
          <input className="input" name="email" type="email" defaultValue={prefill.email} required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" type="tel" defaultValue={prefill.phone} />
        </div>
      </div>

      <div>
        <label className="label">
          Address of event <span className="req">(Required)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input md:col-span-2" name="street" placeholder="Street address" defaultValue={prefill.address} required />
          <input className="input" name="zip" placeholder="zip code" defaultValue={prefill.zip} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">
            Number Of people <span className="req">(Required)</span>
          </label>
          <input className="input" name="people" type="number" defaultValue={prefill.people} required />
        </div>
        <div>
          <label className="label">
            Date <span className="req">(Required)</span>
          </label>
          <input className="input" name="date" placeholder="MM/DD/YYYY" required />
        </div>
        <div>
          <label className="label">
            Time of event (or TBD) <span className="req">(Required)</span>
          </label>
          <input className="input" name="time" placeholder="e.g. 3:00 PM or TBD" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            I&apos;m Interested in <span className="req">(Required)</span>
          </label>
          <div className="flex gap-6 mt-2 flex-wrap">
            {["An ice cream truck", "An ice cream cart", "Both"].map((item) => {
              const checked = interestMap[prefill.interest] === item;
              return (
                <label key={item} className="flex items-center gap-2 text-sm text-[#55555599]">
                  <input type="checkbox" className="checkbox" name="interests" value={item} defaultChecked={checked} />
                  {item}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">
            What&apos;s the nature of the event? <span className="req">(Required)</span>
          </label>
          <select className="input mt-2" name="eventType" defaultValue="" required>
            <option value="" disabled>Select event type</option>
            <option>Employee Appreciation</option>
            <option>Corporate Picnic</option>
            <option>Birthday</option>
            <option>Graduation</option>
            <option>Block Party</option>
            <option>Marketing</option>
            <option>Customer Appreciation</option>
            <option>Tenant Appreciation</option>
            <option>Other Private Event</option>
            <option>Other Corporate Event</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Multiple shifts to be Covered?</label>
        <div className="flex gap-8 mt-2">
          {["Yes", "No"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input type="radio" className="checkbox" name="multipleShifts" value={item} />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Special Notes,</label>
        <textarea
          className="textarea"
          name="specialNotes"
          rows={4}
          placeholder="Message"
          defaultValue={noteFromBot}
        ></textarea>
      </div>

      {status.state === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 text-sm text-green-800 rounded-md">
          {status.message}
        </div>
      )}
      {status.state === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="w-full bg-[#0072B0] text-white py-3 rounded-md hover:bg-sky-800 transition disabled:opacity-60"
      >
        {status.state === "submitting" ? "Sending…" : "Send us your inquiry"}
      </button>

      <style jsx>{`
        .label {
          display: block;
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          font-family: "Archivo", sans-serif;
          margin-bottom: 6px;
        }
        .req {
          color: #d50004;
          font-size: 14px;
          font-weight: 400;
        }
        .input,
        .textarea {
          display: block;
          width: 100%;
          margin-top: 6px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #111;
          font-family: "Archivo", sans-serif;
        }
        .input:focus,
        .textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
        }
        .textarea {
          resize: vertical;
          min-height: 110px;
        }
        .checkbox {
          width: 16px;
          height: 16px;
          accent-color: #0ea5e9;
        }
      `}</style>
    </form>
  );
}
