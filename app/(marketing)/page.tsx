import { ArrowRight, Brain, Flame, Globe2, Sparkles } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

const posters = [
  { title: "I'M\nCOOKED", className: "portal-poster--pink left-[5%] top-[18%]", tilt: "-8deg" },
  { title: "LET 'EM\nCOOK", className: "portal-poster--cream left-[20%] top-[8%]", tilt: "5deg" },
  { title: "ATE\nTHAT", className: "portal-poster--pink right-[19%] top-[12%]", tilt: "-5deg" },
  { title: "AIN'T NO\nWAY", className: "portal-poster--purple right-[5%] top-[18%]", tilt: "7deg" },
  { title: "LOCK\nIN", className: "portal-poster--lime bottom-[23%] left-[11%]", tilt: "6deg" },
  { title: "SIX\nSEVEN", className: "portal-poster--cream bottom-[23%] right-[13%]", tilt: "-5deg" },
];

export default function MarketingPage() {
  return (
    <div className="portal-noise relative isolate min-h-screen overflow-hidden px-6 py-6 text-[#fffdf8] sm:px-10">
      <header className="relative z-20 flex items-center justify-between"><div className="brand-wordmark text-white"><span>วอดส์ <Sparkles className="inline-block h-4 w-4 text-[#b8f500]" aria-hidden="true" /></span><span>MEME</span></div><div className="flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 text-xs font-black tracking-[.1em]"><Globe2 className="h-4 w-4" aria-hidden="true" /> EN</div></header>

      {posters.map((poster) => <div key={poster.title} aria-hidden="true" className={`portal-poster hidden lg:grid ${poster.className}`} style={{ "--tilt": poster.tilt } as CSSProperties}>{poster.title.split("\n").map((line) => <span key={line}>{line}</span>)}</div>)}

      <main className="relative z-10 mx-auto flex min-h-[590px] max-w-3xl flex-col items-center justify-center py-10 text-center lg:min-h-[620px]">
        <span className="text-xs font-black tracking-[.3em] text-[#b8f500]">THE INTERNET ENGLISH SHRINE</span>
        <h1 className="display-font mt-6 text-6xl leading-[.8] text-white sm:text-8xl lg:text-[6.7rem]">DO YOU<br />SPEAK <span className="text-[#b8f500]">INTERNET?</span></h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-[#ded9d0] sm:text-lg">Learn <strong className="text-[#b8f500]">meme</strong>, <strong className="text-[#b8f500]">slang</strong>, and <strong className="text-[#b8f500]">context</strong> - not just dictionary English.</p>
        <Link href="/learn" className="soft-button mt-8 px-7">ENTER THE INTERNET <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <p className="mt-5 text-xs font-bold tracking-[.12em] text-[#aaa69d]">YOU MIGHT LOSE SOME <span className="text-[#f43f8f]">BRAINCELLS</span></p>
        <ShrineMascot />
      </main>

      <footer className="relative z-10 mx-auto grid max-w-5xl gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm sm:grid-cols-3 sm:p-5"><PortalReason icon={Brain} accent="text-[#f43f8f]" title="UNDERSTAND CONTEXT" text="Not just the words, but what they really mean." /><PortalReason icon={Flame} accent="text-[#b8f500]" title="REAL INTERNET ENGLISH" text="The way people actually talk online." /><PortalReason icon={Sparkles} accent="text-[#b78cff]" title="LEVEL UP YOUR AURA" text="Gain Aura, lose Braincells, become meme-native." /></footer>
    </div>
  );
}

function ShrineMascot() {
  return <svg className="mascot-shadow mt-6 h-32 w-24 sm:h-36 sm:w-28" viewBox="0 0 160 220" aria-hidden="true"><ellipse cx="80" cy="206" rx="58" ry="9" fill="rgba(0,0,0,.42)" /><path d="M58 177v28M102 177v28" stroke="#6e3d22" strokeWidth="12" strokeLinecap="round" /><path d="M47 175c-21 7-27 23-27 35M113 175c21 7 27 23 27 35" fill="none" stroke="#9e6033" strokeWidth="10" strokeLinecap="round" /><path d="M49 45c0-20 16-33 31-33s31 13 31 33v125c0 21-14 34-31 34s-31-13-31-34z" fill="#a86737" stroke="#ebad6c" strokeWidth="4" /><path d="M62 27v155M80 17v176M98 27v155" stroke="#7a4426" strokeWidth="4" opacity=".68" /><path d="M51 80c18 6 40 6 58 0M51 120c18 6 40 6 58 0M51 160c18 6 40 6 58 0" stroke="#d99455" strokeWidth="3" opacity=".7" /><path d="M47 43c19-10 47-10 66 0" stroke="#f3c183" strokeWidth="5" strokeLinecap="round" /><path d="M68 56h24" stroke="#57321e" strokeWidth="3" opacity=".55" /></svg>;
}

function PortalReason({ icon: Icon, accent, title, text }: { icon: typeof Brain; accent: string; title: string; text: string }) {
  return <div className="flex gap-3 px-2 py-2 text-left"><Icon className={`mt-0.5 h-7 w-7 shrink-0 ${accent}`} aria-hidden="true" /><div><p className={`text-xs font-black tracking-[.09em] ${accent}`}>{title}</p><p className="mt-1 text-sm leading-5 text-[#ded9d0]">{text}</p></div></div>;
}
