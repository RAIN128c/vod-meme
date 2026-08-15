"use client";

import { ArrowRight, Brain, Check, Crown, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";

import { learningUnits, type LearningUnit } from "@/data/learning-units";
import { formatBraincells, getMemeRank, getNextRank } from "@/lib/progress";
import { isUnitUnlocked, useProgressStore } from "@/store/progress-store";

const posterTones = ["bg-[#ffe7a6]", "bg-[#dcd1ff]", "bg-[#c9e7ff]", "bg-[#ffefaa]", "bg-[#f0ece4]"];

export function LearningPath() {
  const aura = useProgressStore((state) => state.aura);
  const braincells = useProgressStore((state) => state.braincells);
  const completedUnits = useProgressStore((state) => state.completedUnits);
  const debugUnlockAll = useProgressStore((state) => state.debugUnlockAll);
  const setDebugUnlockAll = useProgressStore((state) => state.setDebugUnlockAll);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const rank = getMemeRank(aura);
  const nextRank = getNextRank(aura);
  const coreUnits = learningUnits.filter((unit) => !unit.spotlight);
  const spotlight = learningUnits.find((unit) => unit.spotlight);
  const rankProgress = nextRank ? Math.min(100, (aura / nextRank.minimumAura) * 100) : 100;

  return (
    <div className="mx-auto max-w-[1120px]">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="pt-3">
          <span className="marker-label"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> CURATED LEARNING PATH</span>
          <h1 className="display-font mt-6 text-5xl leading-[.84] text-[#211f1b] sm:text-7xl">INTERNET<br />ENGLISH 101</h1>
          <div className="feature-rule mt-5" />
          <p className="mt-5 max-w-xl text-base leading-7 text-[#746f67]">Learn why an expression works in the moment: not just its dictionary meaning.</p>
        </div>

        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="Learning progress">
          <StatCard icon={Sparkles} label="AURA" value={String(aura)} accent="text-[#7447f5]" />
          <StatCard icon={Brain} label="BRAINCELLS" value={formatBraincells(braincells)} accent="text-[#f43f8f]" />
          <div className="paper-card p-4">
            <div className="flex items-center gap-2 text-[#2984f2]"><Crown className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black tracking-[.12em]">MEME RANK</p></div>
            <p className="display-font mt-2 text-2xl leading-none">{rank.name}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebe5dc]"><div className="h-full rounded-full bg-[#2984f2]" style={{ width: `${rankProgress}%` }} /></div>
            <p className="mt-2 text-xs font-bold text-[#746f67]">{nextRank ? `${nextRank.minimumAura - aura} Aura to ${nextRank.name}` : "Top rank reached"}</p>
          </div>
        </section>
      </header>

      <section className="mt-14 max-w-[810px]">
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[.14em] text-[#746f67]">YOUR COURSE</p><h2 className="display-font mt-1 text-3xl">FOLLOW THE CONTEXT.</h2></div><p className="text-sm font-bold text-[#746f67]">{completedUnits.length}/{coreUnits.length} mastered</p></div>
        <div className="grid gap-5">
          {coreUnits.map((unit, index) => {
            const unlocked = isUnitUnlocked(unit.id, completedUnits, debugUnlockAll);
            const completed = completedUnits.includes(unit.id);
            const content = <LearningUnitCard unit={unit} index={index} unlocked={unlocked} completed={completed} />;
            return unlocked ? <Link key={unit.id} href={`/lesson/${unit.id}`} className="block focus-visible:rounded-2xl">{content}</Link> : <div key={unit.id} aria-disabled="true">{content}</div>;
          })}
        </div>
      </section>

      {spotlight && <section className="paper-card mt-14 grid gap-6 overflow-hidden bg-[#f3efff] p-6 sm:grid-cols-[1fr_190px] sm:p-8"><div className="self-center"><span className="marker-label"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> MEME LITERACY SPOTLIGHT</span><h2 className="display-font mt-5 text-5xl leading-none">{spotlight.title}</h2><p className="mt-3 max-w-lg leading-7 text-[#615b6d]">{spotlight.subtitle}</p><Link href={`/lesson/${spotlight.id}`} className="soft-button mt-6 px-5">GET THE REFERENCE <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div><div className="torn-paper flex min-h-48 flex-col justify-between bg-[#fff8dd] p-5 text-center"><p className="text-xs font-black tracking-[.15em] text-[#f43f8f]">TRENDING</p><p className="display-font text-7xl leading-none text-[#211f1b]">67</p><p className="font-black">SIX SEVEN</p></div></section>}

      <details className="mt-12 text-xs text-[#746f67]"><summary className="cursor-pointer font-bold">Presenter controls</summary><div className="mt-3 flex flex-wrap gap-3"><button type="button" className="rounded-lg border border-[#ded7cb] bg-[#fffdf8] px-3 py-2 hover:bg-[#f1ece2]" onClick={() => setDebugUnlockAll(!debugUnlockAll)}>{debugUnlockAll ? "Disable all unlocks" : "Unlock all units"}</button><button type="button" className="rounded-lg border border-[#ded7cb] bg-[#fffdf8] px-3 py-2 hover:bg-[#f1ece2]" onClick={resetProgress}>Reset local progress</button></div></details>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Sparkles; label: string; value: string; accent: string }) {
  return <div className="paper-card p-4"><div className={`flex items-center gap-2 ${accent}`}><Icon className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black tracking-[.12em]">{label}</p></div><p className={`display-font mt-2 text-3xl leading-none ${accent}`}>{value}</p></div>;
}

function LearningUnitCard({ unit, index, unlocked, completed }: { unit: LearningUnit; index: number; unlocked: boolean; completed: boolean }) {
  const stateLabel = completed ? "MASTERED" : unlocked ? "AVAILABLE" : "LOCKED";
  const stateIcon = completed ? <Check className="h-4 w-4" aria-hidden="true" /> : unlocked ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />;

  return <article className={`torn-paper grid min-h-36 gap-4 p-5 transition sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center ${unlocked ? "hover:-translate-y-0.5" : "opacity-60 grayscale-[.25]"}`}>
    <div className={`relative flex h-20 items-center justify-center overflow-hidden rounded-xl ${posterTones[index]}`}><span className="display-font text-4xl">{String(index + 1).padStart(2, "0")}</span><span className="absolute bottom-2 text-[9px] font-black tracking-[.14em]">{unit.title.split(" ")[0]}</span></div>
    <div><div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-black tracking-[.14em] text-[#746f67]">{unit.type.replace("_", " ")}</p>{completed && <span className="rounded-full bg-[#e8fbc4] px-2 py-1 text-[10px] font-black text-[#526b00]">MASTERED</span>}</div><h3 className="display-font mt-2 text-3xl leading-none">{unit.title}</h3><p className="mt-2 text-sm leading-6 text-[#746f67]">{unit.subtitle}</p></div>
    <div className={`flex min-h-10 items-center gap-1.5 self-start rounded-full px-3 text-[10px] font-black tracking-[.1em] sm:self-auto ${unlocked ? "bg-[#211f1b] text-white" : "bg-[#e3ddd4] text-[#746f67]"}`}>{stateIcon}<span>{stateLabel}</span></div>
  </article>;
}
