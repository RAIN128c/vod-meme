export type LearningUnitType =
  | "SLANG_FAMILY"
  | "INTERNET_EXPRESSION"
  | "MEME_PHRASE";

export type ChallengeType = "MEME_CONTEXT" | "CONTRAST" | "USE_CASE";

export type ChallengeOption = {
  id: string;
  label: string;
  correct: boolean;
};

export type Challenge = {
  id: string;
  type: ChallengeType;
  question: string;
  contextLabel: string;
  context: string;
  leftExpression?: string;
  rightExpression?: string;
  options: ChallengeOption[];
  explanation: {
    answer: string;
    why: string;
    context: string;
    th: string;
  };
  auraReward: number;
  braincellCost: number;
};

export type LearningUnit = {
  id: string;
  type: LearningUnitType;
  title: string;
  subtitle: string;
  meaningTH?: string;
  meaningEN?: string;
  tone: string[];
  aliases: string[];
  variants?: string[];
  examples: { en: string; th: string }[];
  challenges: Challenge[];
  order: number;
  spotlight?: boolean;
};

const BRAIN_CELL_COST = 1_000_000;

function challenge(
  id: string,
  type: ChallengeType,
  contextLabel: string,
  context: string,
  question: string,
  answer: string,
  wrongOne: string,
  wrongTwo: string,
  why: string,
  th: string,
  expressions?: { left: string; right: string }
): Challenge {
  return {
    id,
    type,
    contextLabel,
    context,
    question,
    leftExpression: expressions?.left,
    rightExpression: expressions?.right,
    options: [
      { id: "a", label: answer, correct: true },
      { id: "b", label: wrongOne, correct: false },
      { id: "c", label: wrongTwo, correct: false },
    ],
    explanation: {
      answer,
      why,
      context: "Read the situation and the sentence structure before choosing a literal translation.",
      th,
    },
    auraReward: type === "CONTRAST" ? 4 : 3,
    braincellCost: BRAIN_CELL_COST,
  };
}

export const learningUnits: LearningUnit[] = [
  {
    id: "cook-cooked",
    type: "SLANG_FAMILY",
    title: "COOK / COOKED",
    subtitle: "One small structure change. Completely different outcome.",
    meaningTH: "cook = ทำได้ดีมาก, cooked = งานเข้า / หมดสภาพ",
    meaningEN: "To cook is to perform brilliantly. To be cooked is to be in serious trouble.",
    tone: ["informal", "humorous", "dramatic"],
    aliases: ["cook", "cooked", "he cooked", "she cooked", "bro is cooked", "bro cooked"],
    variants: ["let him cook", "we are cooked"],
    examples: [
      { en: "She cooked that presentation.", th: "พรีเซนต์ได้ดีมาก" },
      { en: "I missed the deadline. I am cooked.", th: "งานเข้าแล้ว" },
    ],
    order: 1,
    challenges: [
      challenge("cook-1", "MEME_CONTEXT", "GROUP CHAT", "A friend shares a first-game video with the highest score. Someone replies: 'bro cooked.'", "What does the reply mean?", "They performed impressively.", "They prepared food.", "They made a mistake.", "As a verb, 'cooked' can praise an excellent performance.", "cooked ในที่นี้เป็นคำชมว่าเขาทำได้โหดมาก"),
      challenge("cook-2", "MEME_CONTEXT", "EXAM WEEK", "You have an exam tomorrow, did not study, and lost your notes. Your friend says: 'you are cooked.'", "What is the friend predicting?", "You are in serious trouble.", "You studied perfectly.", "You should make dinner.", "'Be cooked' describes someone facing a terrible outcome.", "be cooked = งานเข้า / หมดทางรอดในสถานการณ์นั้น"),
      challenge("cook-3", "CONTRAST", "SAME WORD, NEW STRUCTURE", "Watch whether 'cooked' is the action or describes the person's situation.", "Which reading matches both lines?", "Left: praise. Right: he is in trouble.", "Both mean he made food.", "Left: trouble. Right: praise.", "'He cooked' praises an action; 'he is cooked' describes a bad position.", "เติม is แล้วความหมายเปลี่ยนจากชมเป็นงานเข้า", { left: "He cooked.", right: "He's cooked." }),
      challenge("cook-4", "USE_CASE", "FRIEND'S PRESENTATION", "Your friend nailed a difficult presentation and everyone applauded.", "Pick the most natural reply.", "You cooked. That was clean.", "You are cooked. Congrats.", "Please cook the presentation again.", "A strong result calls for the praise form.", "ใช้ cook ชมเวลามีคนทำอะไรออกมาดีมาก"),
      challenge("cook-5", "USE_CASE", "MISSED DEADLINE", "A classmate forgot a final project worth half their grade and the portal is closed.", "Pick the most natural reaction.", "They are cooked.", "They cooked the deadline.", "They are cooking.", "This dramatic reaction fits a clear bad consequence.", "ใช้ are cooked เมื่อผลลัพธ์ดูพังแบบชัดเจน"),
    ],
  },
  {
    id: "lock-in",
    type: "INTERNET_EXPRESSION",
    title: "LOCK IN",
    subtitle: "Focus mode, not a literal lock.",
    meaningTH: "ตั้งใจจริงจัง ตัดสิ่งรบกวน แล้วโฟกัสกับเป้าหมาย",
    meaningEN: "To focus intensely and commit to the task in front of you.",
    tone: ["motivational", "informal", "playful"],
    aliases: ["lock in", "locked in", "time to lock in"],
    examples: [{ en: "Finals are close. I need to lock in.", th: "ใกล้สอบแล้ว ต้องตั้งใจจริงแล้ว" }],
    order: 2,
    challenges: [
      challenge("lock-1", "MEME_CONTEXT", "STUDY ROOM", "Your friend closes every social app, puts on headphones, and says: 'I have to lock in for two hours.'", "What does 'lock in' ask for?", "Focus without distractions.", "Find a physical lock.", "Leave the study room.", "The phrase signals deliberate concentration.", "lock in = เข้าโหมดตั้งใจและตัดสิ่งรบกวน"),
      challenge("lock-2", "CONTRAST", "FOCUS VS ACCESS", "One phrase is about attention. The other means you cannot enter.", "What is the difference?", "Left: focused. Right: cannot access something.", "Both mean focused.", "Left: excluded. Right: concentrating.", "Internet slang uses 'locked in' for commitment; 'locked out' keeps its access meaning.", "locked in คือโฟกัส ส่วน locked out คือเข้าไม่ได้", { left: "I'm locked in.", right: "I'm locked out." }),
      challenge("lock-3", "USE_CASE", "BIG PROJECT", "Your team has one evening to finish a project after wasting the week.", "Choose the natural message.", "No more scrolling. We need to lock in.", "We need to lock out the project.", "We are locked in trouble.", "It is a direct, energetic call to focus.", "ใช้ชวนเพื่อนให้หยุดวอกแวกแล้วลุยจริง"),
    ],
  },
  {
    id: "crash-out",
    type: "INTERNET_EXPRESSION",
    title: "CRASH OUT",
    subtitle: "An emotional overreaction with witnesses.",
    meaningTH: "หลุดหนัก โมโหหรือพังทางอารมณ์แบบเกินเหตุ",
    meaningEN: "To have an intense emotional meltdown or overreaction.",
    tone: ["informal", "dramatic", "often critical"],
    aliases: ["crash out", "crashed out", "about to crash out"],
    examples: [{ en: "He crashed out over one bad comment.", th: "เขาหลุดหนักเพราะคอมเมนต์เดียว" }],
    order: 3,
    challenges: [
      challenge("crash-1", "MEME_CONTEXT", "RANKED GAME", "After one unlucky loss, a player yells, deletes the game, and posts ten angry messages. Chat says: 'he crashed out.'", "What happened?", "He had an extreme emotional reaction.", "His computer physically broke.", "He calmly logged off.", "'Crash out' describes losing emotional control, often over something small.", "crash out = หลุดหรือวีนหนักเกินสถานการณ์"),
      challenge("crash-2", "CONTRAST", "RESPONSE SIZE", "Compare brief disappointment with a reaction that keeps escalating in public.", "Which person is crashing out?", "The person posting all night after one reply.", "The person who moved on calmly.", "Neither person is upset.", "Crashing out is bigger and less controlled than normal frustration.", "crash out ไม่ใช่แค่เซ็ง แต่คือปะทุจนเกินเหตุ", { left: "She was annoyed, then moved on.", right: "She posted all night after one reply." }),
      challenge("crash-3", "USE_CASE", "BAD COMMENT", "Your friend wants to fight everyone after receiving one rude comment.", "Choose the supportive reply.", "Do not crash out over one comment.", "You should crash out quietly.", "Lock in the comment section.", "The phrase can warn someone not to overreact.", "ใช้เตือนเพื่อนว่าอย่าหลุดหนักกับเรื่องเล็ก"),
      challenge("crash-4", "USE_CASE", "MINOR DELAY", "A delivery is thirty minutes late and someone begins insulting the whole company online.", "Which comment fits?", "They are about to crash out.", "They cooked the delivery.", "They are locked in.", "The visible escalation makes the phrase appropriate.", "สถานการณ์นี้กำลังบานปลายเกินเหตุ"),
    ],
  },
  {
    id: "ate",
    type: "SLANG_FAMILY",
    title: "ATE",
    subtitle: "Not food. A full performance.",
    meaningTH: "ทำได้ปังมาก โดยเฉพาะลุค การแสดง หรือผลงานที่โดดเด่น",
    meaningEN: "To do something exceptionally well, often with style or confidence.",
    tone: ["praise", "enthusiastic", "informal"],
    aliases: ["ate", "ate that", "she ate", "he ate"],
    examples: [{ en: "She ate that look up.", th: "ลุคนั้นปังมาก" }],
    order: 4,
    challenges: [
      challenge("ate-1", "MEME_CONTEXT", "AWARD SHOW", "A performer walks on stage in a striking outfit and delivers a perfect speech. Comments say: 'she ate.'", "What are the comments saying?", "She did it exceptionally well.", "She ate before the show.", "She left early.", "'Ate' is enthusiastic praise for a standout performance or look.", "ate = ทำได้ปังมาก ไม่ได้แปลว่ากินจริง"),
      challenge("ate-2", "CONTRAST", "LITERAL VS SLANG", "One sentence needs food; the other celebrates a result.", "Which line uses slang?", "'He ate that performance.'", "'He ate noodles at lunch.'", "'He skipped lunch.'", "The object 'performance' signals praise rather than literal eating.", "ดูคำนามรอบๆ เพื่อแยก ate ที่เป็นคำชมออกจากการกินจริง", { left: "He ate noodles at lunch.", right: "He ate that performance." }),
      challenge("ate-3", "USE_CASE", "DESIGN REVIEW", "Your teammate presents a poster that everyone immediately loves.", "Choose the natural comment.", "You ate that design.", "You are ate by the design.", "Please eat the design.", "This is warm, high-energy praise for a polished result.", "ใช้ ate ชมงานที่ออกมาปังและมีสไตล์"),
      challenge("ate-4", "USE_CASE", "AVERAGE RESULT", "Your friend submits an unfinished draft with obvious errors.", "Which response should you avoid?", "You ate that draft.", "Let us fix the draft first.", "The draft needs another pass.", "'Ate' is exaggerated praise, so it clashes with weak work.", "อย่าใช้ ate แบบประชดถ้าอีกฝ่ายอาจไม่เข้าใจโทน"),
    ],
  },
  {
    id: "aint-no-way",
    type: "INTERNET_EXPRESSION",
    title: "AIN'T NO WAY",
    subtitle: "Disbelief, refusal, or both.",
    meaningTH: "ไม่มีทาง / ไม่อยากเชื่อเลย ขึ้นกับน้ำเสียงและสถานการณ์",
    meaningEN: "A strong expression of disbelief, refusal, or shock.",
    tone: ["informal", "reactive", "dramatic"],
    aliases: ["ain't no way", "aint no way", "no way"],
    examples: [{ en: "Ain't no way that just happened.", th: "ไม่มีทางที่มันเพิ่งเกิดขึ้นจริง" }],
    order: 5,
    challenges: [
      challenge("way-1", "MEME_CONTEXT", "IMPOSSIBLE LUCK", "Your friend wins a prize after entering a contest once. You reply: 'ain't no way.'", "What does the reply show?", "Disbelief and surprise.", "A polite agreement.", "A request for directions.", "The phrase reacts to something that feels too surprising to be real.", "ain't no way ใช้แสดงความไม่อยากเชื่อ"),
      challenge("way-2", "CONTRAST", "TONE CHECK", "The words can show surprise or refusal depending on what comes next.", "Which line is a refusal?", "Ain't no way I am doing that at 6 AM.", "Ain't no way, you met them?", "No way to the station.", "Adding a proposed action turns the phrase into a strong no.", "ถ้าตามด้วยสิ่งที่ไม่ยอมทำ มักแปลว่าปฏิเสธเด็ดขาด", { left: "Ain't no way, you met them?", right: "Ain't no way I am doing that." }),
      challenge("way-3", "USE_CASE", "UNREAL SCORE", "A friend says they completed a hard game on the first try.", "Choose the natural reaction.", "Ain't no way. Show me the replay.", "Ain't no way you cooked dinner.", "Lock in the replay.", "The request for proof keeps the tone as surprised disbelief.", "ใช้ตอบเมื่อเรื่องฟังดูเกินจริงจนอยากเห็นหลักฐาน"),
    ],
  },
  {
    id: "six-seven",
    type: "MEME_PHRASE",
    title: "67 / SIX SEVEN",
    subtitle: "Recognition is the lesson. Not every meme has a dictionary entry.",
    tone: ["referential", "absurd", "community-coded"],
    aliases: ["67", "six seven", "six-seven"],
    examples: [{ en: "The chat started spamming 'six seven' at the callback.", th: "แชตพิมพ์ตามกันเมื่อเจอจังหวะที่รู้กัน" }],
    order: 6,
    spotlight: true,
    challenges: [
      challenge("67-1", "MEME_CONTEXT", "LIVE CHAT", "A stream chat suddenly repeats 'six seven' after a familiar sound cue. No one explains it.", "What is the best reading?", "It is a shared-reference reaction.", "It has one fixed dictionary definition.", "It is a grammar correction.", "Some memes work through recognition and timing rather than literal meaning.", "บางมีมต้องเข้าใจ reference และจังหวะ ไม่ใช่แปลคำตรงตัว"),
      challenge("67-2", "CONTRAST", "LITERAL VS CULTURAL", "One response asks for factual information; the other joins a recognizable callback.", "Which is meme-literate?", "Recognizing the callback and reacting with the group.", "Forcing a precise translation every time.", "Assuming every number is slang.", "Meme literacy includes knowing when context is the meaning.", "ความเข้าใจมีมคือรู้ว่าควรตอบสนองแบบไหนในกลุ่มนั้น", { left: "What number comes after six?", right: "Six seven!" }),
      challenge("67-3", "USE_CASE", "UNKNOWN REFERENCE", "You see an unfamiliar phrase repeated in comments with no clear explanation.", "What is the best first move?", "Check the post, timing, and shared reference.", "Invent a confident definition.", "Use it immediately in every chat.", "Context-first investigation is safer than pretending every meme is universal.", "ถ้าไม่รู้มีม ให้ดูโพสต์และบริบทก่อนเดาความหมาย"),
    ],
  },
];

export const getLearningUnit = (unitId: string) =>
  learningUnits.find((unit) => unit.id === unitId);
