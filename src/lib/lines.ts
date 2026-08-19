/**
 * 대사 사전.
 *
 * 이 앱의 전부예요. 기능은 "열면 한마디 한다"가 끝이고, 재미는 그 한마디가
 * 상황을 정확히 짚을 때 나와요. 그래서 대사를 그냥 무작위로 뽑지 않고
 * **방문 맥락**(오늘 몇 번째인지, 얼마 만에 왔는지, 지금 몇 시인지)으로 후보를 좁힌 다음
 * 그 안에서 뽑아요. 방금 닫았다 다시 열었는데 "오랜만이야"가 나오면 재미가 죽어요.
 *
 * 각 대사에는 고유 id가 있어요. 본 대사는 도감에 쌓이고, 그 수집이
 * "한 번 더 열어볼" 이유가 돼요.
 */

/** 캐릭터 표정이에요. 대사 톤과 함께 움직여요. */
export type Mood = "happy" | "neutral" | "bored" | "annoyed" | "dead";

export interface Line {
  id: string;
  text: string;
  mood: Mood;
}

/** 오늘 첫 방문. 유일하게 반겨주는 구간이에요. */
const FIRST: Line[] = [
  { id: "f1", text: "왔구나. 오늘은 아직 안 질렸어.", mood: "happy" },
  { id: "f2", text: "어서 와. 이때가 제일 반가워.", mood: "happy" },
  { id: "f3", text: "오늘 처음이네. 이 기분 오래 안 가.", mood: "happy" },
  { id: "f4", text: "반가워. 진심이야. 지금은.", mood: "happy" },
  { id: "f5", text: "좋은 아침. 아니면 뭐, 아무 때나.", mood: "happy" },
];

/** 2~3번째. 아직은 봐줄 만해요. */
const SECOND: Line[] = [
  { id: "s1", text: "또 왔네.", mood: "neutral" },
  { id: "s2", text: "음. 두 번째.", mood: "neutral" },
  { id: "s3", text: "뭐 볼 게 있다고.", mood: "neutral" },
  { id: "s4", text: "심심해?", mood: "neutral" },
  { id: "s5", text: "여긴 아무것도 안 바뀌어.", mood: "neutral" },
  { id: "s6", text: "그래. 왔구나. 응.", mood: "neutral" },
];

/** 4~7번째. 슬슬 지겨워해요. */
const BORED: Line[] = [
  { id: "b1", text: "오늘 진짜 자주 온다.", mood: "bored" },
  { id: "b2", text: "할 일 없구나.", mood: "bored" },
  { id: "b3", text: "나 여기 계속 있어. 안 도망가.", mood: "bored" },
  { id: "b4", text: "확인 안 해도 돼.", mood: "bored" },
  { id: "b5", text: "새로고침한다고 뭐가 나오지 않아.", mood: "bored" },
  { id: "b6", text: "…또?", mood: "bored" },
  { id: "b7", text: "이쯤 되면 습관이야.", mood: "bored" },
];

/** 8~15번째. 대놓고 귀찮아해요. */
const ANNOYED: Line[] = [
  { id: "a1", text: "그만 좀 와.", mood: "annoyed" },
  { id: "a2", text: "왜 자꾸 오는 거야 진짜.", mood: "annoyed" },
  { id: "a3", text: "나한테 뭘 바라는 거야.", mood: "annoyed" },
  { id: "a4", text: "다른 앱도 좀 열어봐.", mood: "annoyed" },
  { id: "a5", text: "이제 할 말 없어.", mood: "annoyed" },
  { id: "a6", text: "그래서 뭐. 또 뭐.", mood: "annoyed" },
  { id: "a7", text: "혹시 나 좋아해?", mood: "annoyed" },
];

/** 16번째 이상. 포기하고 드러누워요. */
const DEAD: Line[] = [
  { id: "d1", text: "…", mood: "dead" },
  { id: "d2", text: "(자는 척)", mood: "dead" },
  { id: "d3", text: "말 안 할 거야.", mood: "dead" },
  { id: "d4", text: "졌어. 네가 이겼어.", mood: "dead" },
  { id: "d5", text: "이제 그냥 살아.", mood: "dead" },
  { id: "d6", text: "(눈도 안 마주침)", mood: "dead" },
];

/** 닫자마자 다시 연 경우. 가장 웃긴 구간이라 따로 빼요. */
const INSTANT: Line[] = [
  { id: "i1", text: "방금 나갔잖아.", mood: "annoyed" },
  { id: "i2", text: "뭐 두고 갔어?", mood: "annoyed" },
  { id: "i3", text: "3초 만에 뭐가 바뀌었겠어.", mood: "annoyed" },
  { id: "i4", text: "닫는 걸 봤는데.", mood: "annoyed" },
  { id: "i5", text: "장난해?", mood: "annoyed" },
];

/** 오랜만에 온 경우. 반가운 척도 안 해요. */
const COMEBACK: Line[] = [
  { id: "c1", text: "누구세요?", mood: "neutral" },
  { id: "c2", text: "한참 만이네. 잘 지냈어? 난 그냥 있었어.", mood: "neutral" },
  { id: "c3", text: "지웠는 줄 알았어.", mood: "neutral" },
  { id: "c4", text: "이제 와서.", mood: "bored" },
  { id: "c5", text: "그동안 아무 일도 없었어. 여긴 원래 그래.", mood: "neutral" },
];

/** 새벽에 온 경우. */
const LATE_NIGHT: Line[] = [
  { id: "n1", text: "이 시간에?", mood: "bored" },
  { id: "n2", text: "자야지.", mood: "bored" },
  { id: "n3", text: "새벽에 여는 앱이 이거라니.", mood: "bored" },
  { id: "n4", text: "내일 후회한다.", mood: "bored" },
];

/**
 * 간식을 받았을 때만 나오는 말이에요.
 *
 * 이 앱에서 뚱냥이가 유일하게 누그러지는 순간이라, 아무리 시큰둥한 상태여도
 * 간식 앞에서는 톤이 풀려요. 광고를 끝까지 본 사람에게만 열리는 칸이에요.
 */
const TREAT: Line[] = [
  { id: "t1", text: "이건 좀 맛있네.", mood: "happy" },
  { id: "t2", text: "봐줄게. 오늘만.", mood: "happy" },
  { id: "t3", text: "다음에도 이거 가져와.", mood: "happy" },
  { id: "t4", text: "…고마워. 못 들은 걸로 해.", mood: "happy" },
  { id: "t5", text: "역시 사람은 쓸모가 있어.", mood: "happy" },
  { id: "t6", text: "한 개 더 없어?", mood: "neutral" },
  { id: "t7", text: "이래서 내가 널 못 버려.", mood: "happy" },
];

/**
 * 코를 눌렀을 때 나오는 말이에요.
 *
 * 얼굴이 눌리는 동안 짧게 뜨는 말이라 한 문장을 넘기지 않아요.
 */
const POKE: Line[] = [
  { id: "p1", text: "야.", mood: "annoyed" },
  { id: "p2", text: "코 만지지 마.", mood: "annoyed" },
  { id: "p3", text: "숨 막혀.", mood: "annoyed" },
  { id: "p4", text: "그거 누르면 뭐 나와?", mood: "bored" },
  { id: "p5", text: "한 번만 더 해봐.", mood: "annoyed" },
  { id: "p6", text: "…(참는 중)", mood: "dead" },
];

/**
 * 쓰다듬었을 때 나오는 말이에요.
 *
 * 이 앱에서 뚱냥이가 티 나게 좋아하는 유일한 순간이에요. 그래도 솔직하게
 * 좋다고는 안 해요.
 */
const PET: Line[] = [
  { id: "e1", text: "…계속해.", mood: "happy" },
  { id: "e2", text: "(그르릉)", mood: "happy" },
  { id: "e3", text: "거기 말고 턱.", mood: "neutral" },
  { id: "e4", text: "나쁘지 않네.", mood: "happy" },
  { id: "e5", text: "이건 봐준다.", mood: "happy" },
  { id: "e6", text: "손 치워. 아니 두고.", mood: "neutral" },
];

/**
 * 총 방문 횟수 기념 대사예요.
 *
 * 정확히 그 번째에 왔을 때만 나와서, 도감에서 제일 채우기 어려운 칸이에요.
 */
const MILESTONES: { at: number; line: Line }[] = [
  { at: 10, line: { id: "m10", text: "열 번째. 벌써 정이 들 뻔했어.", mood: "neutral" } },
  { at: 50, line: { id: "m50", text: "50번. 슬슬 무서워지는데.", mood: "bored" } },
  { at: 100, line: { id: "m100", text: "100번째야. 축하해. 안 기쁘지?", mood: "annoyed" } },
  { at: 300, line: { id: "m300", text: "300번. 우리 이제 가족인가.", mood: "annoyed" } },
  { at: 500, line: { id: "m500", text: "500번. 인생에서 뭘 하고 있는 거야.", mood: "dead" } },
  { at: 1000, line: { id: "m1000", text: "1000번. 나는 이제 너의 일부야.", mood: "dead" } },
];

/** 도감에 실리는 전체 대사예요. 수집률을 세는 기준이 돼요. */
export const ALL_LINES: Line[] = [
  ...FIRST,
  ...TREAT,
  ...POKE,
  ...PET,
  ...SECOND,
  ...BORED,
  ...ANNOYED,
  ...DEAD,
  ...INSTANT,
  ...COMEBACK,
  ...LATE_NIGHT,
  ...MILESTONES.map((milestone) => milestone.line),
];

export const TOTAL_LINE_COUNT = ALL_LINES.length;

/** 방문 맥락이에요. 이 값들로 어떤 묶음에서 뽑을지 정해요. */
export interface VisitContext {
  /** 오늘 몇 번째 방문인지예요. 이번 방문을 포함해요. */
  todayCount: number;
  /** 전체 몇 번째 방문인지예요. 이번 방문을 포함해요. */
  totalCount: number;
  /** 직전 방문으로부터 지난 시간(밀리초)이에요. 첫 실행이면 null이에요. */
  sinceLastMs: number | null;
  /** 지금 시각(0~23)이에요. */
  hour: number;
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

function pick(lines: Line[], seed: number): Line {
  return lines[seed % lines.length];
}

/**
 * 맥락에 맞는 대사를 하나 골라요.
 *
 * 우선순위가 있어요. 마일스톤 > 즉시 재방문 > 복귀 > 새벽 > 방문 횟수.
 * 특별한 순간일수록 앞에 둬서, 어렵게 만난 대사가 평범한 대사에 묻히지 않게 해요.
 */
export function pickLine(context: VisitContext, seed: number = Date.now()): Line {
  const milestone = MILESTONES.find((item) => item.at === context.totalCount);
  if (milestone != null) return milestone.line;

  if (context.sinceLastMs != null && context.sinceLastMs < 30 * 1000) {
    return pick(INSTANT, seed);
  }

  if (context.sinceLastMs != null && context.sinceLastMs > 7 * DAY) {
    return pick(COMEBACK, seed);
  }

  // 새벽 대사는 그날 첫 방문일 때만 써요. 새벽에 열 번 열면 밤샘 자체를 놀리는 게 아니라
  // 자주 오는 걸 놀려야 맞아요.
  if ((context.hour >= 2 && context.hour < 6) && context.todayCount <= 1) {
    return pick(LATE_NIGHT, seed);
  }

  if (context.todayCount <= 1) return pick(FIRST, seed);
  if (context.todayCount <= 3) return pick(SECOND, seed);
  if (context.todayCount <= 7) return pick(BORED, seed);
  if (context.todayCount <= 15) return pick(ANNOYED, seed);
  return pick(DEAD, seed);
}

/**
 * 간식을 줬을 때 나올 말을 골라요.
 *
 * **아직 안 들은 말을 먼저 줘요.** 광고를 봤는데 이미 들은 말이 또 나오면
 * 다음부터 안 보게 돼요. 다 들었을 때만 그중에서 아무거나 골라요.
 */
export function pickTreatLine(seenIds: string[] = [], seed: number = Date.now()): Line {
  const unheard = TREAT.filter((line) => !seenIds.includes(line.id));
  const pool = unheard.length > 0 ? unheard : TREAT;
  return pool[seed % pool.length];
}

/** 코를 눌렀을 때 나올 말을 골라요. 못 들은 말을 먼저 줘요. */
export function pickPokeLine(seenIds: string[] = [], seed: number = Date.now()): Line {
  return pickUnheardFirst(POKE, seenIds, seed);
}

/** 쓰다듬었을 때 나올 말을 골라요. 못 들은 말을 먼저 줘요. */
export function pickPetLine(seenIds: string[] = [], seed: number = Date.now()): Line {
  return pickUnheardFirst(PET, seenIds, seed);
}

/** 아직 못 들은 것부터 고르고, 다 들었으면 그중에서 아무거나 골라요. */
function pickUnheardFirst(lines: Line[], seenIds: string[], seed: number): Line {
  const unheard = lines.filter((line) => !seenIds.includes(line.id));
  const pool = unheard.length > 0 ? unheard : lines;
  return pool[seed % pool.length];
}

/** 간식으로 들을 수 있는 말이 아직 남았는지예요. */
export function hasUnheardTreat(seenIds: string[]): boolean {
  return TREAT.some((line) => !seenIds.includes(line.id));
}

/** 도감에서 묶어 보여줄 분류예요. */
export const LINE_GROUPS: { title: string; hint: string; lines: Line[] }[] = [
  { title: "오늘의 첫 인사", hint: "하루에 처음 열면 나와요", lines: FIRST },
  { title: "또 왔네", hint: "하루에 두세 번 열면 나와요", lines: SECOND },
  { title: "지겨움", hint: "하루에 네 번 넘게 열면 나와요", lines: BORED },
  { title: "짜증", hint: "하루에 여덟 번 넘게 열면 나와요", lines: ANNOYED },
  { title: "포기", hint: "하루에 열여섯 번 넘게 열면 나와요", lines: DEAD },
  { title: "방금 갔잖아", hint: "닫고 30초 안에 다시 열면 나와요", lines: INSTANT },
  { title: "오랜만", hint: "일주일 넘게 안 오다 오면 나와요", lines: COMEBACK },
  { title: "새벽", hint: "새벽 2시에서 6시 사이 첫 방문에 나와요", lines: LATE_NIGHT },
  { title: "간식", hint: "간식을 주면 들을 수 있어요", lines: TREAT },
  { title: "코 찌르기", hint: "뚱냥이 코를 누르면 나와요", lines: POKE },
  { title: "쓰다듬기", hint: "뚱냥이를 문지르면 나와요", lines: PET },
  {
    title: "기념일",
    hint: "정해진 방문 횟수에 딱 맞춰야 나와요",
    lines: MILESTONES.map((milestone) => milestone.line),
  },
];
