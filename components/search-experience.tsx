"use client";

import { ArrowUpRight, ImagePlus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { searchCuratedDataset, type CuratedSearchResult } from "@/lib/search-dataset";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CuratedSearchResult | null>();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(searchCuratedDataset(query));
  }

  return (
    <div className="mx-auto max-w-[960px] pb-8">
      <header className="mx-auto max-w-2xl text-center"><span className="marker-label"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> CULTURAL-LANGUAGE DECODER</span><h1 className="display-font mt-7 text-5xl leading-[.84] sm:text-7xl">WHAT DID BRO<br />MEAN?</h1><div className="feature-rule mx-auto mt-5" /><p className="mt-5 text-base leading-7 text-[#746f67]">Paste the English the internet throws at you. We’ll decode meaning, tone, and context from the curated lesson set.</p></header>

      <form className="paper-card mt-10 flex items-center gap-3 p-2 sm:p-3" onSubmit={onSubmit}>
        <Search className="ml-3 h-6 w-6 shrink-0 text-[#746f67]" aria-hidden="true" />
        <label className="sr-only" htmlFor="meme-search">Search a meme phrase or slang expression</label>
        <input id="meme-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: bro is cooked" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-lg font-bold outline-none placeholder:text-[#a49d93] sm:text-xl" />
        <button type="submit" className="soft-button h-12 w-12 shrink-0 p-0" aria-label="Decode search phrase"><Search className="h-5 w-5" aria-hidden="true" /></button>
      </form>

      <section className="torn-paper mt-8 grid gap-6 bg-[#fffaf0] p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8" aria-label="Screenshot search status"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f2ff] text-[#2984f2]"><ImagePlus className="h-7 w-7" aria-hidden="true" /></div><div><p className="text-xs font-black tracking-[.13em] text-[#2984f2]">SCREENSHOT SEARCH · P2</p><p className="mt-2 font-bold">Image upload is not available in this prototype yet.</p><p className="mt-1 text-sm leading-6 text-[#746f67]">We will only enable it once server-side validation and structured interpretation are ready. No fake AI flow.</p></div></section>

      {result === undefined ? null : result ? <SearchResult result={result} /> : <section className="paper-card mt-8 p-7"><p className="display-font text-3xl">NO CURATED MATCH YET.</p><p className="mt-3 max-w-2xl leading-7 text-[#746f67]">AI fallback is intentionally disabled in this MVP, so we will not invent an explanation. Try COOK, LOCK IN, CRASH OUT, ATE, AIN&apos;T NO WAY, or SIX SEVEN.</p></section>}
    </div>
  );
}

function SearchResult({ result }: { result: CuratedSearchResult }) {
  return (
    <section className="paper-card mt-10 overflow-hidden">
      <header className="border-b border-[#ded7cb] bg-[#fffaf0] px-6 py-7 sm:px-8"><span className="marker-label">CURATED</span><p className="mt-7 text-xs font-black tracking-[.14em] text-[#2984f2]">DETECTED</p><h2 className="display-font mt-2 text-5xl leading-none sm:text-6xl">{result.detectedPhrase}</h2></header>
      <div className="grid gap-4 p-6 sm:p-8"><ResultRow title="MEANING" main={result.meaningTH} detail={result.meaningEN} accent="bg-[#e7fbc0]" /><ResultRow title="TONE" main={result.tone.join(" · ")} detail="How the expression feels in this context." accent="bg-[#eee7ff]" /><ResultRow title="WHY / CONTEXT" main={result.context} detail="Context determines which reading is actually correct." accent="bg-[#e6f2ff]" /></div>
      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#ded7cb] bg-[#fffaf0] px-6 py-5 sm:px-8"><div><p className="text-[10px] font-black tracking-[.14em] text-[#746f67]">RELATED EXPRESSIONS</p><p className="mt-1 text-sm font-bold">{result.relatedExpressions.join(" / ")}</p></div><Link href={`/lesson/${result.relatedUnitId}`} className="soft-button px-5">LEARN THIS UNIT <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></footer>
    </section>
  );
}

function ResultRow({ title, main, detail, accent }: { title: string; main: string; detail: string; accent: string }) {
  return <article className="grid gap-4 rounded-2xl border border-[#e7e0d5] bg-[#fffdf8] p-5 sm:grid-cols-[150px_1fr] sm:items-start"><span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-black tracking-[.1em] ${accent}`}>{title}</span><div><p className="font-black leading-6 text-[#302d28]">{main}</p><p className="mt-1 text-sm leading-6 text-[#746f67]">{detail}</p></div></article>;
}
