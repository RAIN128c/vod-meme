"use client";

import { ArrowLeft, Brain, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";

import { ChallengeRenderer, CheckLabel } from "@/components/challenge-renderer";
import { FeedbackPanel } from "@/components/feedback-panel";
import type { LearningUnit } from "@/data/learning-units";
import { formatBraincells, getMemeRank } from "@/lib/progress";
import { isUnitUnlocked, useProgressStore } from "@/store/progress-store";

type LessonShellProps = { unit: LearningUnit };

export function LessonShell({ unit }: LessonShellProps) {
  const aura = useProgressStore((state) => state.aura);
  const braincells = useProgressStore((state) => state.braincells);
  const completedChallenges = useProgressStore((state) => state.completedChallenges);
  const completedUnits = useProgressStore((state) => state.completedUnits);
  const debugUnlockAll = useProgressStore((state) => state.debugUnlockAll);
  const awardChallenge = useProgressStore((state) => state.awardChallenge);
  const completeUnit = useProgressStore((state) => state.completeUnit);
  const setCurrentUnit = useProgressStore((state) => state.setCurrentUnit);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [answeredChallengeId, setAnsweredChallengeId] = useState<string>();
  const [status, setStatus] = useState<"ready" | "correct" | "wrong">("ready");
  const [rewardGranted, setRewardGranted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const playSound = useLessonSound();

  const activeChallenge = answeredChallengeId
    ? unit.challenges.find((challenge) => challenge.id === answeredChallengeId)
    : unit.challenges.find((challenge) => !completedChallenges.includes(challenge.id));
  const completedCount = unit.challenges.filter((challenge) => completedChallenges.includes(challenge.id)).length;
  const rank = getMemeRank(aura);
  const unlocked = unit.spotlight || isUnitUnlocked(unit.id, completedUnits, debugUnlockAll);

  useEffect(() => {
    setCurrentUnit(unit.id);
    return () => setCurrentUnit(undefined);
  }, [setCurrentUnit, unit.id]);

  const resetChallengeState = () => {
    setSelectedOptionId(undefined);
    setAnsweredChallengeId(undefined);
    setStatus("ready");
    setRewardGranted(false);
  };

  const onCheck = () => {
    if (!activeChallenge || !selectedOptionId || status !== "ready") return;
    const selected = activeChallenge.options.find((option) => option.id === selectedOptionId);
    setAnsweredChallengeId(activeChallenge.id);
    if (selected?.correct) {
      playSound("correct");
      setRewardGranted(awardChallenge(activeChallenge.id, activeChallenge.auraReward, activeChallenge.braincellCost));
      setStatus("correct");
      return;
    }
    playSound("wrong");
    setStatus("wrong");
  };

  const onContinue = () => {
    if (status === "wrong") {
      resetChallengeState();
      return;
    }
    const isFinalChallenge = activeChallenge && completedCount === unit.challenges.length;
    if (isFinalChallenge) {
      completeUnit(unit.id);
      setCurrentUnit(undefined);
      setShowCompletion(true);
      return;
    }
    resetChallengeState();
  };

  if (!unlocked) return <LockedLesson />;
  if (showCompletion) return <Completion unit={unit} aura={aura} rank={rank.name} />;
  if (!activeChallenge) return <CompletionGate unit={unit} />;

  return (
    <div className="min-h-screen bg-[#f8f4ec]">
      <header className="lesson-topbar px-5 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1060px] items-center gap-3 sm:gap-5">
          <Link href="/learn" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#ded7cb] bg-[#fffdf8] text-[#211f1b] shadow-sm hover:bg-[#f1ece2]" aria-label="Close lesson and return to learning path"><X className="h-5 w-5" aria-hidden="true" /></Link>
          <div className="hidden shrink-0 md:block"><span className="text-base font-black">วอดส์</span><span className="ml-1 rounded bg-[#7447f5] px-1.5 py-0.5 text-xs font-black text-white">MEME</span></div>
          <div className="min-w-0 flex-1"><div className="h-2.5 overflow-hidden rounded-full bg-[#e8e2d9]"><div className="h-full rounded-full bg-[#b8f500] transition-[width] duration-300" style={{ width: `${(completedCount / unit.challenges.length) * 100}%` }} /></div><p className="mt-1.5 text-[10px] font-black tracking-[.12em] text-[#746f67]">{unit.title} · {Math.min(completedCount + 1, unit.challenges.length)} OF {unit.challenges.length}</p></div>
          <div className="stat-pill hidden items-center gap-2 px-3 py-2 sm:flex"><Sparkles className="h-4 w-4 text-[#7447f5]" aria-hidden="true" /><span className="text-xs font-black">{aura} AURA</span></div>
          <div className="stat-pill hidden items-center gap-2 px-3 py-2 lg:flex"><Brain className="h-4 w-4 text-[#f43f8f]" aria-hidden="true" /><span className="text-xs font-black">{formatBraincells(braincells)} BRAINCELLS</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[840px] px-5 pb-14 pt-12 sm:px-8 lg:pt-16">{status === "ready" ? <><ChallengeRenderer challenge={activeChallenge} selectedOptionId={selectedOptionId} status={status} onSelect={(optionId) => { setSelectedOptionId(optionId); playSound("select"); }} /><button type="button" disabled={!selectedOptionId} onClick={onCheck} className="soft-button lesson-check-button mt-9 w-full"><CheckLabel /></button></> : <FeedbackPanel challenge={activeChallenge} status={status} rewardGranted={rewardGranted} onContinue={onContinue} />}</main>
    </div>
  );
}

type LessonSound = "select" | "correct" | "wrong";

function useLessonSound() {
  const contextRef = useRef<AudioContext | null>(null);

  return (sound: LessonSound) => {
    if (typeof window === "undefined") return;
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    if (context.state === "suspended") void context.resume();

    const notes = sound === "correct" ? [523, 659] : sound === "wrong" ? [220, 174] : [392];
    const now = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.075;
      oscillator.type = sound === "wrong" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(sound === "select" ? 0.025 : 0.045, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.13);
    });
  };
}

function CompletionGate({ unit }: { unit: LearningUnit }) {
  const completeUnit = useProgressStore((state) => state.completeUnit);
  const aura = useProgressStore((state) => state.aura);
  const rank = getMemeRank(aura);

  useEffect(() => { completeUnit(unit.id); }, [completeUnit, unit.id]);
  return <Completion unit={unit} aura={aura} rank={rank.name} />;
}

function LockedLesson() {
  return <div className="paper-grid flex min-h-screen items-center justify-center px-5"><section className="paper-card max-w-md p-8 text-center"><span className="marker-label">SEQUENTIAL PATH ACTIVE</span><h1 className="display-font mt-6 text-5xl leading-none">THIS LORE IS STILL LOCKED.</h1><p className="mt-5 leading-7 text-[#746f67]">Clear the previous unit first, then come back with more context.</p><Link href="/learn" className="soft-button mt-7 px-5"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> BACK TO PATH</Link></section></div>;
}

function Completion({ unit, aura, rank }: { unit: LearningUnit; aura: number; rank: string }) {
  return <div className="paper-grid relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"><CompletionConfetti /><section className="torn-paper relative w-full max-w-xl p-8 text-center sm:p-11"><div className="mx-auto flex h-24 max-w-[240px] items-end justify-center gap-2"><Image src={`/assets/units/${unit.id}.png`} alt="" width={118} height={158} className="h-20 w-auto object-contain" /><Image src="/assets/mascot/celebrate.png" alt="" width={140} height={154} className="h-24 w-auto object-contain" /></div><span className="marker-label mt-6">COLLECTIBLE POSTER UNLOCKED</span><h1 className="display-font mt-6 text-6xl leading-none sm:text-7xl">MASTERED</h1><p className="mt-3 text-xl font-black">{unit.title}</p><p className="mx-auto mt-5 max-w-sm leading-7 text-[#746f67]">You can now read this expression for meaning, tone, and context.</p><div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#ded7cb] py-5 text-left"><div><p className="text-[10px] font-black tracking-[.14em] text-[#746f67]">TOTAL AURA</p><p className="display-font mt-2 text-3xl text-[#7447f5]">{aura}</p></div><div><p className="text-[10px] font-black tracking-[.14em] text-[#746f67]">MEME RANK</p><div className="mt-2 flex items-center gap-2"><p className="display-font text-2xl">{rank}</p>{rank === "NORMIE" && <Image src="/assets/rank/normie.png" alt="Normie rank badge" width={104} height={118} className="h-10 w-auto" />}</div></div></div><Link href="/learn" className="soft-button mt-8 px-6">CONTINUE PATH <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" /></Link></section></div>;
}

function CompletionConfetti() {
  const { width, height } = useWindowSize();
  if (!width || !height) return null;

  return <Confetti className="pointer-events-none" width={width} height={height} recycle={false} numberOfPieces={180} tweenDuration={5500} gravity={0.18} colors={["#b8f500", "#7447f5", "#f43f8f", "#2984f2", "#ff6b35"]} aria-hidden="true" />;
}
