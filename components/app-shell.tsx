"use client";

import { BookOpen, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const navItems = [
    { href: "/learn", label: "LEARN", icon: BookOpen },
    { href: "/search", label: "SEARCH", icon: Search },
  ];

  return (
    <div className="paper-grid min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex border-b border-[#ded7cb] bg-[rgba(255,253,248,.86)] px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-7 lg:py-9">
        <Link href="/learn" className="brand-wordmark" aria-label="วอดส์ MEME, ไปยังหน้าบทเรียน">
          <span>วอดส์ <Sparkles className="inline-block h-4 w-4 text-[#b8f500]" aria-hidden="true" /></span>
          <span>MEME</span>
        </Link>

        <nav className="ml-auto flex gap-1 lg:ml-0 lg:mt-16 lg:flex-col" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-black transition ${active ? "bg-[#eaffb4] text-[#211f1b]" : "text-[#746f67] hover:bg-[#f1ece2] hover:text-[#211f1b]"}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden tracking-[.04em] sm:inline lg:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="paper-note mt-auto hidden -rotate-2 p-4 lg:block">
          <p className="display-font text-xl leading-none text-[#211f1b]">LEARN MEMES.</p>
          <p className="mt-2 text-sm font-black leading-5 text-[#7447f5]">SPEAK INTERNET.<br />UNLOCK AURA.</p>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
