"use client";

import { ArrowRight, Lightbulb } from "lucide-react";

import type { Challenge } from "@/data/learning-units";

type ChallengeRendererProps = {
  challenge: Challenge;
  selectedOptionId?: string;
  status: "ready" | "correct" | "wrong";
  onSelect: (optionId: string) => void;
};

function AnswerOptions({ challenge, selectedOptionId, status, onSelect }: ChallengeRendererProps) {
  return (
    <div className="mt-7 grid gap-3">
      {challenge.options.map((option, index) => {
        const selected = option.id === selectedOptionId;
        const revealCorrect = status !== "ready" && option.correct;
        const revealWrong = status === "wrong" && selected && !option.correct;
        const stateClass = revealCorrect ? "choice-card--correct" : revealWrong ? "choice-card--wrong" : selected ? "choice-card--selected" : "";
        return (
          <button key={option.id} type="button" disabled={status !== "ready"} onClick={() => onSelect(option.id)} className={`choice-card flex items-center gap-4 px-5 text-left text-base font-bold disabled:cursor-default ${stateClass}`}>
            <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChallengeHeading({ challenge, hint }: { challenge: Challenge; hint?: string }) {
  return <><p className="text-xs font-black tracking-[.14em] text-[#7447f5]">{challenge.contextLabel}</p><h1 className="display-font mt-3 text-4xl leading-[.94] sm:text-5xl">{challenge.question}</h1>{hint && <p className="mt-4 flex items-center gap-2 text-sm leading-6 text-[#746f67]"><Lightbulb className="h-4 w-4 shrink-0 text-[#f1b900]" aria-hidden="true" />{hint}</p>}</>;
}

export function MemeContextChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  return <><section className="torn-paper bg-[#fff8e9] p-7 sm:p-9"><p className="text-[10px] font-black tracking-[.18em] text-[#f43f8f]">SOCIAL CONTEXT</p><p className="mt-5 text-xl font-bold leading-8 text-[#302d28] sm:text-2xl">{challenge.context}</p></section><div className="mt-9"><ChallengeHeading challenge={challenge} hint="Read the situation first, then choose the meaning." /><AnswerOptions {...props} /></div></>;
}

export function ContrastChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  return <><ChallengeHeading challenge={challenge} hint={challenge.context} /><div className="mt-8 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"><article className="paper-card p-7 text-center"><p className="text-xs font-black tracking-[.12em] text-[#746f67]">LEFT</p><p className="display-font mt-5 text-4xl leading-none sm:text-5xl">{challenge.leftExpression}</p><div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#b8f500]" /></article><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fbe0ec] text-sm font-black text-[#e82b7f]">VS</span><article className="paper-card p-7 text-center"><p className="text-xs font-black tracking-[.12em] text-[#746f67]">RIGHT</p><p className="display-font mt-5 text-4xl leading-none sm:text-5xl">{challenge.rightExpression}</p><div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#f43f8f]" /></article></div><AnswerOptions {...props} /></>;
}

export function UseCaseChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  return <><section className="paper-card relative overflow-hidden p-7 sm:p-9"><div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#e6f5ff]" aria-hidden="true" /><p className="text-[10px] font-black tracking-[.18em] text-[#2984f2]">{challenge.contextLabel}</p><p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-[#302d28] sm:text-2xl">{challenge.context}</p></section><div className="mt-9"><ChallengeHeading challenge={challenge} hint="Pick the response that sounds natural in this exact moment." /><AnswerOptions {...props} /></div></>;
}

export function ChallengeRenderer(props: ChallengeRendererProps) {
  if (props.challenge.type === "CONTRAST") return <ContrastChallenge {...props} />;
  if (props.challenge.type === "USE_CASE") return <UseCaseChallenge {...props} />;
  return <MemeContextChallenge {...props} />;
}

export function CheckLabel() {
  return <>CHECK <ArrowRight className="h-4 w-4" aria-hidden="true" /></>;
}
