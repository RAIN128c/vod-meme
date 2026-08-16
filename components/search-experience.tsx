"use client";

import { ArrowUpRight, ImagePlus, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

import type { InterpretationResult } from "@/lib/interpretation";
import { searchCuratedDataset } from "@/lib/search-dataset";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [result, setResult] = useState<InterpretationResult | null>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const curated = imageFile ? null : searchCuratedDataset(trimmedQuery);
    setError(undefined);

    if (curated) {
      setResult(curated);
      return;
    }
    if (!trimmedQuery && !imageFile) {
      setResult(undefined);
      setError("Paste a phrase or add a screenshot first.");
      return;
    }

    setIsLoading(true);
    setResult(undefined);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedQuery,
          imageDataUrl: imageFile ? await readFileAsDataUrl(imageFile) : undefined,
        }),
      });
      const payload = await response.json() as InterpretationResult | { error?: string };
      if (!response.ok || !("source" in payload)) throw new Error("error" in payload ? payload.error : "Couldn\'t interpret this yet.");
      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn\'t interpret this yet.");
    } finally {
      setIsLoading(false);
    }
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isSupportedImage(file)) {
      setError("Use a PNG, JPG, or WebP screenshot under 4 MB.");
      return;
    }
    setError(undefined);
    setImageFile(file);
  }

  function clearImage() {
    setImageFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="mx-auto max-w-[960px] pb-8">
      <header className="mx-auto max-w-2xl text-center"><span className="marker-label"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> CULTURAL-LANGUAGE DECODER</span><h1 className="display-font mt-7 text-5xl leading-[.84] sm:text-7xl">WHAT DID BRO<br />MEAN?</h1><div className="feature-rule mx-auto mt-5" /><p className="mt-5 text-base leading-7 text-[#746f67]">Search the curated lesson set first. Unknown phrases and screenshots can use AI interpretation when configured.</p></header>

      <form className="paper-card mt-10 flex items-center gap-3 p-2 sm:p-3" onSubmit={onSubmit}>
        <Search className="ml-3 h-6 w-6 shrink-0 text-[#746f67]" aria-hidden="true" />
        <label className="sr-only" htmlFor="meme-search">Search a meme phrase or slang expression</label>
        <input id="meme-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: bro is cooked" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-lg font-bold outline-none placeholder:text-[#a49d93] sm:text-xl" />
        <button type="submit" disabled={isLoading} className="soft-button h-12 w-12 shrink-0 p-0" aria-label={isLoading ? "Decoding" : "Decode search phrase"}><Search className="h-5 w-5" aria-hidden="true" /></button>
      </form>

      <section className="torn-paper mt-8 grid gap-5 bg-[#fffaf0] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8" aria-label="Screenshot interpretation">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f2ff] text-[#2984f2]"><ImagePlus className="h-7 w-7" aria-hidden="true" /></div>
        <div><p className="text-xs font-black tracking-[.13em] text-[#2984f2]">SCREENSHOT INTERPRETATION - P2</p><p className="mt-2 font-bold">Drop in a meme or screenshot when the text alone is not enough.</p><p className="mt-1 text-sm leading-6 text-[#746f67]">PNG, JPG, or WebP up to 4 MB. It is sent only when you choose DECODE.</p>{imageFile && <p className="mt-3 flex items-center gap-2 text-sm font-black text-[#302d28]"><span className="max-w-[220px] truncate">{imageFile.name}</span><button type="button" onClick={clearImage} className="rounded-full p-1 text-[#746f67] hover:bg-[#efe9df]" aria-label="Remove selected screenshot"><X className="h-4 w-4" aria-hidden="true" /></button></p>}</div>
        <div><input ref={fileInputRef} id="screenshot-input" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onImageChange} /><label htmlFor="screenshot-input" className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#b9d6f8] bg-[#f4f9ff] px-4 text-xs font-black tracking-[.1em] text-[#176acb] transition hover:bg-[#e7f2ff]">{imageFile ? "CHANGE IMAGE" : "ADD SCREENSHOT"}</label></div>
      </section>

      <div className="mt-5 min-h-6" aria-live="polite">{isLoading && <p className="text-sm font-bold text-[#7447f5]">DECODING CONTEXT...</p>}{error && <p className="text-sm font-bold text-[#e45d2c]">{error}</p>}</div>
      {result ? <SearchResult result={result} /> : null}
    </div>
  );
}

function SearchResult({ result }: { result: InterpretationResult }) {
  const isAi = result.source === "AI";
  const imageResult = isAi && (result.detectedText || result.visualContext);

  return (
    <section className="paper-card mt-5 overflow-hidden">
      <header className="border-b border-[#ded7cb] bg-[#fffaf0] px-6 py-7 sm:px-8"><span className={`marker-label ${isAi ? "!bg-[#eee7ff] !text-[#5530bf]" : ""}`}>{isAi ? "AI INTERPRETATION" : "CURATED"}</span><p className="mt-7 text-xs font-black tracking-[.14em] text-[#2984f2]">DETECTED</p><h2 className="display-font mt-2 text-5xl leading-none sm:text-6xl">{result.detectedPhrase}</h2></header>
      <div className="grid gap-4 p-6 sm:p-8"><ResultRow title="MEANING" main={result.meaningTH} detail={result.meaningEN} accent="bg-[#e7fbc0]" /><ResultRow title="TONE" main={result.tone.join(" / ")} detail="How the expression feels in this context." accent="bg-[#eee7ff]" /><ResultRow title="WHY / CONTEXT" main={result.context} detail="Context determines which reading is actually correct." accent="bg-[#e6f2ff]" />{imageResult && <ResultRow title="SCREENSHOT CLUE" main={result.detectedText ?? "No decisive text detected."} detail={result.visualContext ?? "No additional visual clue detected."} accent="bg-[#ffe8f2]" />}</div>
      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#ded7cb] bg-[#fffaf0] px-6 py-5 sm:px-8"><div><p className="text-[10px] font-black tracking-[.14em] text-[#746f67]">RELATED EXPRESSIONS</p><p className="mt-1 text-sm font-bold">{result.relatedExpressions.length ? result.relatedExpressions.join(" / ") : "No curated match yet"}</p></div>{result.relatedUnitId ? <Link href={`/lesson/${result.relatedUnitId}`} className="soft-button px-5">LEARN THIS UNIT <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link> : <p className="text-sm font-bold text-[#746f67]">No related lesson yet.</p>}</footer>
    </section>
  );
}

function ResultRow({ title, main, detail, accent }: { title: string; main: string; detail: string; accent: string }) {
  return <article className="grid gap-4 rounded-2xl border border-[#e7e0d5] bg-[#fffdf8] p-5 sm:grid-cols-[150px_1fr] sm:items-start"><span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-black tracking-[.1em] ${accent}`}>{title}</span><div><p className="font-black leading-6 text-[#302d28]">{main}</p><p className="mt-1 text-sm leading-6 text-[#746f67]">{detail}</p></div></article>;
}

function isSupportedImage(file: File) {
  return ["image/png", "image/jpeg", "image/webp"].includes(file.type) && file.size <= MAX_IMAGE_BYTES;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Couldn\'t read that screenshot."));
    reader.onerror = () => reject(new Error("Couldn\'t read that screenshot."));
    reader.readAsDataURL(file);
  });
}
