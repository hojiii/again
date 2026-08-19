/**
 * 방문 기록.
 *
 * 저장하는 건 숫자 몇 개와 본 대사 id뿐이에요. 서버도 로그인도 없어요.
 * 계산을 전부 순수 함수로 빼서 "16번째 방문에 뭐가 나오는지"를 테스트로 확인해요.
 */

import { pickLine, type Line, type VisitContext } from "./lines";

export interface VisitState {
  /** 지금까지 총 몇 번 열었는지예요. */
  totalCount: number;
  /** 오늘 몇 번 열었는지예요. */
  todayCount: number;
  /** todayCount가 어느 날짜의 것인지예요. (YYYY-MM-DD) */
  todayKey: string;
  /** 마지막으로 연 시각이에요. */
  lastVisitAt: number | null;
  /** 며칠 연속으로 열었는지예요. */
  streakDays: number;
  /** 본 적 있는 대사 id예요. 도감을 채우는 기준이에요. */
  seenLineIds: string[];
}

export const EMPTY_STATE: VisitState = {
  totalCount: 0,
  todayCount: 0,
  todayKey: "",
  lastVisitAt: null,
  streakDays: 0,
  seenLineIds: [],
};

/** 로컬 시간 기준 날짜 키예요. UTC로 하면 자정 근처에서 날짜가 어긋나요. */
export function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 두 날짜 키가 하루 차이인지 봐요. 연속 방문을 이어갈지 정할 때 써요. */
function isNextDay(previous: string, current: string): boolean {
  if (previous === "") return false;

  const previousDate = new Date(`${previous}T00:00:00`);
  const currentDate = new Date(`${current}T00:00:00`);
  const diff = currentDate.getTime() - previousDate.getTime();
  return diff === 24 * 60 * 60 * 1000;
}

export interface VisitResult {
  state: VisitState;
  context: VisitContext;
  line: Line;
  /** 이번에 처음 본 대사인지예요. 도감에 새로 담겼다고 알려줄 때 써요. */
  isNewLine: boolean;
}

/**
 * 방문 한 번을 기록하고, 이번에 보여줄 대사를 정해요.
 *
 * @param previous 직전까지의 상태예요.
 * @param now 지금 시각이에요. 테스트에서 시간을 고정하려고 인자로 받아요.
 * @param seed 같은 맥락에서 어떤 대사를 뽑을지 정하는 값이에요.
 */
export function registerVisit(
  previous: VisitState,
  now: Date = new Date(),
  seed: number = now.getTime(),
): VisitResult {
  const key = dayKey(now);
  const isSameDay = previous.todayKey === key;

  const todayCount = isSameDay ? previous.todayCount + 1 : 1;
  const totalCount = previous.totalCount + 1;

  // 연속일은 하루에 몇 번을 열든 하루치만 올라가요.
  const streakDays = isSameDay
    ? Math.max(previous.streakDays, 1)
    : isNextDay(previous.todayKey, key)
      ? previous.streakDays + 1
      : 1;

  const context: VisitContext = {
    todayCount,
    totalCount,
    sinceLastMs: previous.lastVisitAt == null ? null : now.getTime() - previous.lastVisitAt,
    hour: now.getHours(),
  };

  const line = pickLine(context, seed);
  const isNewLine = !previous.seenLineIds.includes(line.id);

  return {
    state: {
      totalCount,
      todayCount,
      todayKey: key,
      lastVisitAt: now.getTime(),
      streakDays,
      seenLineIds: isNewLine ? [...previous.seenLineIds, line.id] : previous.seenLineIds,
    },
    context,
    line,
    isNewLine,
  };
}

/** "3번째" 처럼 읽히게 붙여요. */
export function ordinal(count: number): string {
  return `${count.toLocaleString("ko-KR")}번째`;
}
