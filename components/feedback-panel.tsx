"use client";

import { ArrowRight, Brain, Sparkles } from "lucide-react";

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
    <section className={`paper-card mt-9 overflow-hidden ${correct ? "bg-[#fbfff2]" : "bg-[#fff8f3]"}`}>
      <div className={`px-6 py-5 sm:px-8 ${correct ? "bg-[#eaffb4]" : "bg-[#ffe2d5]"}`}>
        <p className="text-xs font-black tracking-[.16em]">{correct ? "YOU READ THE ROOM" : "BRO, READ THE ROOM"}</p>
        <h2 className="display-font mt-2 text-4xl leading-none sm:text-5xl">{correct ? "THAT'S THE CONTEXT." : "NOT QUITE. TRY AGAIN."}</h2>
        {correct ? <div className="mt-4 flex flex-wrap gap-3 text-sm font-black"><span className="flex items-center gap-1.5 text-[#7447f5]"><Sparkles className="h-4 w-4" aria-hidden="true" />{rewardGranted ? `+${challenge.auraReward} AURA` : "REWARD RECORDED"}</span>{rewardGranted && <span className="flex items-center gap-1.5 text-[#e82b7f]"><Brain className="h-4 w-4" aria-hidden="true" />-{challenge.braincellCost.toLocaleString()} BRAINCELLS</span>}</div> : <p className="mt-4 text-sm font-bold text-[#746f67]">No Aura gained. Braincells preserved. Read the clue and try again.</p>}
      </div>

      <div className="grid gap-5 p-6 text-sm leading-6 sm:grid-cols-3 sm:p-8">
        <Explanation title="ANSWER" value={challenge.explanation.answer} accent="text-[#5b7800]" />
        <Explanation title="WHY" value={challenge.explanation.why} accent="text-[#7447f5]" />
        <Explanation title="CONTEXT" value={challenge.explanation.context} note={challenge.explanation.th} accent="text-[#e82b7f]" />
      </div>

      <div className="border-t border-[#ded7cb] px-6 py-5 sm:px-8"><button type="button" onClick={onContinue} className="soft-button px-5">{correct ? "CONTINUE" : "TRY AGAIN"} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>
    </section>
  );
}

function Explanation({ title, value, note, accent }: { title: string; value: string; note?: string; accent: string }) {
  return <div><p className={`text-[10px] font-black tracking-[.16em] ${accent}`}>{title}</p><p className="mt-2 font-bold text-[#302d28]">{value}</p>{note && <p className="mt-2 text-xs leading-5 text-[#746f67]">{note}</p>}</div>;
}
