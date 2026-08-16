"use client";

import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MarketingPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.22;
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return () => audio.pause();
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
      return;
    }
    audio.pause();
    setPlaying(false);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#07090a] text-[#fffdf8]">
      <Image src="/assets/portal/shrine-background.png" alt="Dark concrete shrine with meme posters and Tung Tung mascot" fill priority sizes="100vw" className="object-contain object-center" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.48),rgba(0,0,0,.1)_38%,rgba(0,0,0,.28)),linear-gradient(0deg,rgba(0,0,0,.55),transparent_42%)]" />
      <audio ref={audioRef} src="/audio/portal-theme.mp3" autoPlay loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />

      <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 py-6 sm:px-10 sm:py-8">
        <div className="brand-wordmark text-white"><span>วอดส์ <Sparkles className="inline-block h-4 w-4 text-[#b8f500]" aria-hidden="true" /></span><span>MEME</span></div>
        <button type="button" onClick={() => void toggleMusic()} className="flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-black/45 px-3 text-xs font-black tracking-[.1em] backdrop-blur-sm transition hover:bg-black/65" aria-label={playing ? "Pause portal music" : "Play portal music"}>{playing ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}{playing ? "MUSIC ON" : "MUSIC OFF"}</button>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center sm:px-10">
        <h1 className="display-font text-6xl leading-[.8] text-white drop-shadow-[0_6px_10px_rgba(0,0,0,.7)] sm:text-8xl lg:text-[6.7rem]">DO YOU<br />SPEAK <span className="text-[#b8f500]">INTERNET?</span></h1>
        <Link href="/learn" className="soft-button mt-9 px-7">ENTER THE INTERNET <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </main>
    </div>
  );
}
