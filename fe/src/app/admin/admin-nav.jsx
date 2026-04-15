"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/chats", label: "Chat leads" },
  { href: "/admin/contacts", label: "Contact form" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-2">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 py-1.5 text-sm rounded-md border transition ${
              active
                ? "bg-pink-100 border-pink-300 text-pink-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
