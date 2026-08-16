"use client";

import { ArrowRight, Brain, Crown, LockKeyhole, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { learningUnits, type LearningUnit } from "@/data/learning-units";
import { formatBraincells, getMemeRank, getNextRank } from "@/lib/progress";
import { isUnitUnlocked, useProgressStore } from "@/store/progress-store";

const posterTones = ["bg-[#ffe7a6]", "bg-[#dcd1ff]", "bg-[#c9e7ff]", "bg-[#ffefaa]", "bg-[#f0ece4]"];
const journeyOffsets = ["xl:-translate-x-1", "xl:translate-x-3", "xl:-translate-x-2", "xl:translate-x-2", "xl:-translate-x-1"];
const posterPaths: Record<string, string> = {
  "cook-cooked": "/assets/units/cook-cooked.png",
  "lock-in": "/assets/units/lock-in.png",
  "crash-out": "/assets/units/crash-out.png",
  ate: "/assets/units/ate.png",
  "aint-no-way": "/assets/units/aint-no-way.png",
};

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
  const rankProgress = nextRank
    ? Math.min(
        100,
        ((aura - rank.minimumAura) /
          (nextRank.minimumAura - rank.minimumAura)) *
          100
      )
    : 100;

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <div className="min-w-0">
          <header>
            <h1 className="display-font text-5xl leading-[.84] text-[#211f1b] sm:text-6xl">INTERNET<br />ENGLISH 101</h1>
            <div className="feature-rule mt-4" />
          </header>

          <section className="mt-6" aria-label="Learning units">
            <div className="grid gap-2">
              {coreUnits.map((unit, index) => {
                const unlocked = isUnitUnlocked(unit.id, completedUnits, debugUnlockAll);
                const completed = completedUnits.includes(unit.id);
                return <LearningUnitCard key={unit.id} unit={unit} index={index} unlocked={unlocked} completed={completed} journeyOffset={journeyOffsets[index] ?? ""} />;
              })}
            </div>
          </section>
        </div>

        <aside className="grid gap-4" aria-label="Learning progress">
          <StatCard icon={Sparkles} label="AURA" value={String(aura)} accent="text-[#7447f5]" />
          <StatCard icon={Brain} label="BRAINCELLS" value={formatBraincells(braincells, false)} accent="text-[#f43f8f]" valueClassName="whitespace-nowrap text-[1.72rem] tracking-[-.02em]" />
          <section className="paper-card p-4">
            <div className="flex items-center gap-2 text-[#2984f2]"><Crown className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black tracking-[.12em]">MEME RANK</p></div>
            <p className="display-font mt-2 text-3xl leading-none">{rank.name}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebe5dc]"><div className="h-full rounded-full bg-[#2984f2]" style={{ width: `${rankProgress}%` }} /></div>
            <p className="mt-2 text-xs font-bold text-[#746f67]">{nextRank ? `${nextRank.minimumAura - aura} Aura to ${nextRank.name}` : "Top rank reached"}</p>
          </section>
          {spotlight && <SpotlightCard unit={spotlight} />}
        </aside>
      </div>

      <details className="mt-10 text-xs text-[#746f67]"><summary className="cursor-pointer font-bold">Presenter controls</summary><div className="mt-3 flex flex-wrap gap-3"><button type="button" className="rounded-lg border border-[#ded7cb] bg-[#fffdf8] px-3 py-2 hover:bg-[#f1ece2]" onClick={() => setDebugUnlockAll(!debugUnlockAll)}>{debugUnlockAll ? "Disable all unlocks" : "Unlock all units"}</button><button type="button" className="rounded-lg border border-[#ded7cb] bg-[#fffdf8] px-3 py-2 hover:bg-[#f1ece2]" onClick={resetProgress}>Reset local progress</button></div></details>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, valueClassName = "text-4xl" }: { icon: typeof Sparkles; label: string; value: string; accent: string; valueClassName?: string }) {
  return <section className="paper-card p-4"><div className={`flex items-center gap-2 ${accent}`}><Icon className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black tracking-[.12em]">{label}</p></div><p className={`display-font mt-2 leading-none ${accent} ${valueClassName}`}>{value}</p></section>;
}

function SpotlightCard({ unit }: { unit: LearningUnit }) {
  return <section className="paper-card overflow-hidden bg-[#f3efff] p-3"><div className="torn-paper relative flex min-h-56 flex-col justify-between bg-[#fff8dd] p-4 text-center"><Image src="/assets/decor/tape-pink.png" alt="" width={174} height={43} className="pointer-events-none absolute -right-7 -top-2 h-9 w-auto rotate-[7deg] mix-blend-multiply" /><p className="text-xs font-black tracking-[.15em] text-[#f43f8f]">TRENDING</p><div><Image src="/assets/units/six-seven.png" alt="" width={118} height={158} className="mx-auto h-20 w-auto object-contain" /><p className="mt-1 font-black">SIX SEVEN</p><p className="mt-2 text-sm leading-5 text-[#615b6d]">{unit.subtitle}</p></div><Link href={`/lesson/${unit.id}`} className="soft-button w-full px-3">GET THE REFERENCE <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></section>;
}

function LearningUnitCard({ unit, index, unlocked, completed, journeyOffset }: { unit: LearningUnit; index: number; unlocked: boolean; completed: boolean; journeyOffset: string }) {
  const totalAura = unit.challenges.reduce((total, challenge) => total + challenge.auraReward, 5);
  const posterPath = posterPaths[unit.id];

  return <article className={`torn-paper grid min-h-[92px] gap-2 p-3 transition sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center ${journeyOffset} ${unlocked ? "hover:-translate-y-0.5" : "opacity-60 grayscale-[.25]"}`}>
    <div className="relative h-[68px] w-[88px]"><Image src={posterPath} alt="" width={64} height={88} className="absolute right-0 h-[68px] w-[52px] object-contain" /><span className={`absolute left-0 top-4 flex h-8 min-w-8 items-center justify-center rounded-md px-1 text-sm font-black text-[#211f1b] ${posterTones[index]}`}>{String(index + 1).padStart(2, "0")}</span></div>
    <div><h3 className="display-font text-3xl leading-none">{unit.title}</h3><p className="mt-1 text-sm leading-5 text-[#746f67]">{unit.subtitle}</p></div>
    <div className="flex items-center gap-2 self-start sm:self-auto">{completed ? <span className="stamp-mastered" aria-label="Mastered">MASTERED</span> : <span className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-[.1em] ${unlocked ? "bg-[#dfff7a] text-[#344600]" : "bg-[#e3ddd4] text-[#746f67]"}`}>{unlocked ? "AVAILABLE" : "LOCKED"}</span>}{completed ? <Link href={`/lesson/${unit.id}`} aria-label={`Review ${unit.title}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211f1b] text-white transition hover:bg-[#7447f5]"><ArrowRight className="h-4 w-4" aria-hidden="true" /></Link> : unlocked ? <RewardPreview unit={unit} totalAura={totalAura} /> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3ddd4] text-[#746f67]"><LockKeyhole className="h-4 w-4" aria-hidden="true" /></span>}</div>
  </article>;
}

function RewardPreview({ unit, totalAura }: { unit: LearningUnit; totalAura: number }) {
  return <Dialog><DialogTrigger asChild><button type="button" aria-label={`View rewards for ${unit.title}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211f1b] text-white transition hover:bg-[#7447f5]"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button></DialogTrigger><DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border-2 border-[#211f1b] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#7447f5]"><DialogHeader><p className="text-xs font-black tracking-[.15em] text-[#7447f5]">LESSON REWARD</p><DialogTitle className="display-font text-4xl leading-none">{unit.title}</DialogTitle><DialogDescription className="leading-6 text-[#746f67]">{unit.subtitle}</DialogDescription></DialogHeader><div className="mt-2 border-y-2 border-[#211f1b] py-4"><p className="text-xs font-black tracking-[.14em] text-[#746f67]">IF YOU CLEAR EVERY CHECK</p><p className="display-font mt-2 text-4xl leading-none text-[#7447f5]">UP TO +{totalAura} AURA</p></div><p className="text-sm font-bold text-[#746f67]">{unit.challenges.length} context checks, plus a 5 Aura completion bonus.</p><Link href={`/lesson/${unit.id}`} className="soft-button w-full">START LESSON <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></DialogContent></Dialog>;
}
