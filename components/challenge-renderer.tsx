"use client";

import { ArrowRight, Lightbulb, Pause, Send, Users, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Challenge } from "@/data/learning-units";

type ChallengeRendererProps = {
  challenge: Challenge;
  selectedOptionId?: string;
  status: "ready" | "correct" | "wrong";
  onSelect: (optionId: string) => void;
};

type NarrationState = {
  currentTime: number;
  duration: number;
  blocked: boolean;
};

function AnswerOptions({ challenge, selectedOptionId, status, onSelect }: ChallengeRendererProps) {
  return (
    <div className="lesson-choice-list mt-7 grid gap-3">
      {challenge.options.map((option, index) => {
        const selected = option.id === selectedOptionId;
        const revealCorrect = status !== "ready" && option.correct;
        const revealWrong = status === "wrong" && selected && !option.correct;
        const stateClass = revealCorrect ? "choice-card--correct" : revealWrong ? "choice-card--wrong" : selected ? "choice-card--selected" : "";

        return (
          <button key={option.id} type="button" disabled={status !== "ready"} onClick={() => onSelect(option.id)} className={`choice-card lesson-choice-reveal flex items-center gap-4 px-5 text-left text-base font-bold disabled:cursor-default ${stateClass}`}>
            <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChallengeHeading({ challenge, hint }: { challenge: Challenge; hint?: string }) {
  return <><p className="text-xs font-black tracking-[.14em] text-[#7447f5]">YOUR READ</p><h1 className="display-font mt-3 text-4xl leading-[.94] sm:text-5xl">{challenge.question}</h1>{hint && <p className="mt-4 flex items-center gap-2 text-sm leading-6 text-[#746f67]"><Lightbulb className="h-4 w-4 shrink-0 text-[#f1b900]" aria-hidden="true" />{hint}</p>}</>;
}

export function MemeContextChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  const scene = splitQuotedContext(challenge.context);
  const [narration, setNarration] = useState<NarrationState>({ currentTime: 0, duration: 0, blocked: false });
  const [sceneRun, setSceneRun] = useState(0);
  const replyAt = challenge.voiceoverReplyAt ?? Number.POSITIVE_INFINITY;
  const typingAt = challenge.voiceoverTypingAt ?? replyAt;
  const replyVisible = !challenge.voiceoverSrc || narration.blocked || narration.currentTime >= replyAt;
  const typingVisible = !replyVisible && narration.currentTime >= typingAt;

  const handleNarrationProgress = useCallback((currentTime: number, duration: number) => {
    setNarration((state) => ({ ...state, currentTime, duration }));
  }, []);

  const handleNarrationStart = useCallback(() => {
    setNarration((state) => ({ ...state, currentTime: 0, blocked: false }));
    setSceneRun((run) => run + 1);
  }, []);

  const handleNarrationBlocked = useCallback(() => {
    setNarration((state) => ({ ...state, blocked: true }));
  }, []);

  return <><section className="lesson-reveal lesson-reveal--scene chat-scene"><header className="chat-scene__header"><span className="marker-label">ENCOUNTER</span><div className="flex items-center gap-2"><SceneNarration src={challenge.voiceoverSrc} onProgress={handleNarrationProgress} onStart={handleNarrationStart} onBlocked={handleNarrationBlocked} /><span className="flex items-center gap-1.5 text-[10px] font-black tracking-[.14em] text-[#746f67]"><Users className="h-4 w-4 text-[#f43f8f]" aria-hidden="true" />{challenge.contextLabel}</span></div></header><div key={sceneRun} className="scene-chat-layout"><section className="scene-brief"><p className="scene-brief__label">THE SCENE</p><NarratedWords text={scene.before} currentTime={narration.currentTime} wordStarts={challenge.voiceoverWordStarts} active={!!challenge.voiceoverSrc && !narration.blocked} /></section><section className="chat-window" aria-label={`${challenge.contextLabel} conversation`}><header className="chat-window__header"><span className="chat-avatar chat-avatar--group" aria-hidden="true"><Users className="h-4 w-4" /></span><div><p className="chat-window__name">Game night</p><p className="chat-window__meta">3 people online</p></div></header><div className="chat-window__body">{typingVisible && <p className="chat-typing" aria-hidden="true">Milo is typing<span>.</span><span>.</span><span>.</span></p>}{replyVisible && scene.quote && <div className="chat-row chat-row--incoming chat-reply--arrive" role="status" aria-live="polite"><span className="chat-avatar chat-avatar--friend" aria-hidden="true">M</span><div className="chat-message chat-message--incoming"><p className="chat-author">MILO</p><p className="chat-reply-text">{scene.quote}</p></div></div>}{replyVisible && scene.after && <p className="chat-caption">{scene.after}</p>}</div></section></div></section><div className="lesson-reveal lesson-reveal--question mt-9"><ChallengeHeading challenge={challenge} hint="Read the moment. The chat message is the clue." /><AnswerOptions {...props} /></div></>;
}

export function ContrastChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  return <><div className="lesson-reveal lesson-reveal--scene"><ChallengeHeading challenge={challenge} hint={challenge.context} /></div><div className="lesson-reveal lesson-reveal--question mt-8 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"><ContrastCard label="LEFT" expression={challenge.leftExpression ?? ""} counterpart={challenge.rightExpression ?? ""} accent="bg-[#b8f500]" /><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fbe0ec] text-sm font-black text-[#e82b7f]">VS</span><ContrastCard label="RIGHT" expression={challenge.rightExpression ?? ""} counterpart={challenge.leftExpression ?? ""} accent="bg-[#f43f8f]" /></div><AnswerOptions {...props} /></>;
}

export function UseCaseChallenge(props: ChallengeRendererProps) {
  const { challenge } = props;
  return <><section className="lesson-reveal lesson-reveal--scene chat-scene chat-scene--use-case"><header className="chat-scene__header"><span className="flex items-center gap-2 text-[10px] font-black tracking-[.16em] text-[#2984f2]"><Send className="h-4 w-4" aria-hidden="true" />{challenge.contextLabel}</span><span className="text-[10px] font-black tracking-[.14em] text-[#746f67]">PRACTICE CHAT</span></header><div className="chat-stream"><div className="chat-row"><span className="chat-avatar chat-avatar--friend" aria-hidden="true">F</span><div className="chat-message chat-message--scene"><p className="chat-author">FRIEND</p><p>{challenge.context}</p></div></div><p className="chat-caption">Your turn to reply.</p></div></section><div className="lesson-reveal lesson-reveal--question mt-9"><ChallengeHeading challenge={challenge} hint="Pick the reply you would actually send." /><AnswerOptions {...props} /></div></>;
}

function splitQuotedContext(context: string) {
  const match = /'([^']+)'/.exec(context);
  if (!match || match.index === undefined) return { before: context, quote: "", after: "" };
  return {
    before: context.slice(0, match.index).replace(/\s*[:.]\s*$/, "").trim(),
    quote: match[1],
    after: context.slice(match.index + match[0].length).trim(),
  };
}

function NarratedWords({ text, currentTime, wordStarts, active }: { text: string; currentTime: number; wordStarts?: number[]; active: boolean }) {
  const words = text.split(" ");
  const currentWord = wordStarts?.length === words.length ? wordStarts.reduce((current, start, index) => currentTime >= start ? index : current, -1) : -1;
  return <p>{words.map((word, index) => <span key={`${word}-${index}`} className={`narrated-word ${active && index === currentWord ? "narrated-word--current" : ""}`}>{word}{index < words.length - 1 ? " " : ""}</span>)}</p>;
}

function SceneNarration({ src, onProgress, onStart, onBlocked }: { src?: string; onProgress: (currentTime: number, duration: number) => void; onStart: () => void; onBlocked: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoStartedRef = useRef(false);
  const frameRef = useRef<number | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    autoStartedRef.current = false;
  }, [src]);

  const playAudio = useCallback(async (restart: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (restart) {
      audio.currentTime = 0;
      onStart();
    }
    try {
      await audio.play();
      setPlaying(true);
      setFinished(false);
    } catch {
      setPlaying(false);
      onBlocked();
    }
  }, [onBlocked, onStart]);

  const syncProgress = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (!audio) return;
      onProgress(audio.currentTime, audio.duration);
      if (!audio.paused && !audio.ended) frameRef.current = requestAnimationFrame(tick);
    };
    if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    tick();
  }, [onProgress]);

  const stopSync = useCallback(() => {
    if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!src || !audio || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void playAudio(true);
    return () => {
      audio.pause();
      stopSync();
    };
  }, [playAudio, src, stopSync]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void playAudio(finished || audio.ended || audio.currentTime === 0);
      return;
    }
    audio.pause();
    setPlaying(false);
  };

  return <><audio ref={audioRef} src={src} preload="metadata" onLoadedMetadata={(event) => onProgress(event.currentTarget.currentTime, event.currentTarget.duration)} onPlay={syncProgress} onEnded={(event) => { stopSync(); setPlaying(false); setFinished(true); onProgress(event.currentTarget.duration, event.currentTarget.duration); }} onPause={() => { stopSync(); setPlaying(false); }} /><button type="button" className="scene-audio-button" onClick={toggle} aria-label={playing ? "Pause scene narration" : finished ? "Replay scene narration" : "Listen to scene narration"}>{playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />}{playing ? "PAUSE" : finished ? "REPLAY" : "LISTEN"}</button></>;
}

function ContrastCard({ label, expression, counterpart, accent }: { label: string; expression: string; counterpart: string; accent: string }) {
  const change = contrastDifference(expression, counterpart);
  return <article className="contrast-card paper-card p-7 text-center"><p className="text-xs font-black tracking-[.12em] text-[#746f67]">{label}</p><p className="display-font mt-5 text-4xl leading-none sm:text-5xl">{expression}</p><p className="mt-5 text-[10px] font-black tracking-[.15em] text-[#746f67]">{change}</p><div className={`mx-auto mt-3 h-1 w-20 rounded-full ${accent}`} /></article>;
}

function contrastDifference(expression: string, counterpart: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/\b(\w+)'s\b/g, "$1 is").replace(/\b(\w+)'m\b/g, "$1 am").match(/[a-z]+/g) ?? [];
  const current = normalize(expression);
  const other = new Set(normalize(counterpart));
  const unique = current.filter((word) => !other.has(word));
  return unique.length ? `NEW CLUE: ${unique.join(" + ").toUpperCase()}` : "WATCH THE STRUCTURE";
}

export function ChallengeRenderer(props: ChallengeRendererProps) {
  if (props.challenge.type === "CONTRAST") return <ContrastChallenge {...props} />;
  if (props.challenge.type === "USE_CASE") return <UseCaseChallenge {...props} />;
  return <MemeContextChallenge key={props.challenge.id} {...props} />;
}

export function CheckLabel() {
  return <>CHECK <ArrowRight className="h-4 w-4" aria-hidden="true" /></>;
}
