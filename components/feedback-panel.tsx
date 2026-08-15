"use client";

import { ArrowRight, Brain, ChevronDown, Sparkles } from "lucide-react";

import type { Challenge } from "@/data/learning-units";

type FeedbackPanelProps = {
  challenge: Challenge;
  status: "correct" | "wrong";
  rewardGranted: boolean;
  onContinue: () => void;
};

export function FeedbackPanel({ challenge, status, rewardGranted, onContinue }: FeedbackPanelProps) {
  const correct = status === "correct";
  return (
    <section className={`feedback-panel paper-card overflow-hidden ${correct ? "bg-[#fbfff2]" : "bg-[#fff8f3]"}`} aria-live="polite">
      <div className={`feedback-panel__hero px-6 py-5 sm:px-8 ${correct ? "bg-[#eaffb4]" : "bg-[#ffe2d5]"}`}>
        <span className={`feedback-reaction ${correct ? "feedback-reaction--correct" : "feedback-reaction--wrong"}`} aria-hidden="true">{correct ? <Sparkles className="h-6 w-6" /> : <Brain className="h-6 w-6" />}</span>
        <p className="text-xs font-black tracking-[.16em]">{correct ? "YOU READ THE ROOM" : "BRO, READ THE ROOM"}</p>
        <h2 className="display-font mt-2 text-4xl leading-none sm:text-5xl">{correct ? "THAT'S THE CONTEXT." : "NOT QUITE. TRY AGAIN."}</h2>
        {correct ? <div className="mt-4 flex flex-wrap gap-3 text-sm font-black"><span className="flex items-center gap-1.5 text-[#7447f5]"><Sparkles className="h-4 w-4" aria-hidden="true" />{rewardGranted ? `+${challenge.auraReward} AURA` : "REWARD RECORDED"}</span>{rewardGranted && <span className="flex items-center gap-1.5 text-[#e82b7f]"><Brain className="h-4 w-4" aria-hidden="true" />-{challenge.braincellCost.toLocaleString()} BRAINCELLS</span>}</div> : <p className="mt-4 text-sm font-bold text-[#746f67]">No Aura gained. Braincells preserved. Read the clue and try again.</p>}
      </div>

      <div className="p-6 sm:p-8">
        <div className="feedback-answer"><p className="text-[10px] font-black tracking-[.16em] text-[#5b7800]">THE ANSWER</p><p className="mt-2 text-lg font-black leading-7 text-[#302d28]">{challenge.explanation.answer}</p></div>
        <details className="feedback-details mt-4" open><summary>WHY THIS WORKS <ChevronDown className="h-4 w-4" aria-hidden="true" /></summary><p>{challenge.explanation.why}</p></details>
        <details className="feedback-details mt-3"><summary>CONTEXT CLUE <ChevronDown className="h-4 w-4" aria-hidden="true" /></summary><p>{challenge.explanation.context}</p><p className="mt-2 text-xs font-bold text-[#746f67]">{challenge.explanation.th}</p></details>
      </div>

      <div className="border-t border-[#ded7cb] px-6 py-5 sm:px-8"><button type="button" onClick={onContinue} className="soft-button px-5">{correct ? "CONTINUE" : "TRY AGAIN"} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>
    </section>
  );
}
