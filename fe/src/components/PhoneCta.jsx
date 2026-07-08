"use client";
import { trackPhoneClick } from "../lib/analytics/track-lead";

const PHONE_DISPLAY = "(708) 529-8875";
const PHONE_HREF = "tel:+17085298875";

export default function PhoneCta({ source, className }) {
  return (
    <a
      href={PHONE_HREF}
      onClick={() => trackPhoneClick(source)}
      className={
        className ||
        "inline-flex items-center gap-2 bg-[#0072B0] text-white px-6 py-3 rounded-full font-archivo font-semibold hover:bg-sky-800 transition"
      }
    >
      📞 Call Now: {PHONE_DISPLAY}
    </a>
  );
}
