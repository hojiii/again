import { describe, expect, it } from "vitest";
import { EMPTY_STATE, dayKey, isFlopped, registerVisit, type VisitState } from "./visits";
import { ALL_LINES, LINE_GROUPS, hasUnheardTreat, pickLine, pickTreatLine } from "./lines";

/** 낮 시간으로 고정해요. 새벽 대사가 끼어들면 방문 횟수 검증이 흐려져요. */
function at(iso: string): Date {
  return new Date(iso);
}

function stateAfter(visits: string[], initial: VisitState = EMPTY_STATE): VisitState {
  return visits.reduce((state, iso) => registerVisit(state, at(iso), 0).state, initial);
}

describe("registerVisit", () => {
  it("첫 방문은 오늘 1번째이자 전체 1번째예요", () => {
    const result = registerVisit(EMPTY_STATE, at("2026-08-19T10:00:00"), 0);

    expect(result.state.todayCount).toBe(1);
    expect(result.state.totalCount).toBe(1);
    expect(result.state.streakDays).toBe(1);
  });

  it("같은 날 다시 열면 오늘 횟수가 올라가요", () => {
    const state = stateAfter(["2026-08-19T10:00:00", "2026-08-19T14:00:00"]);

    expect(state.todayCount).toBe(2);
    expect(state.totalCount).toBe(2);
  });

  it("날짜가 바뀌면 오늘 횟수만 초기화되고 총 횟수는 이어져요", () => {
    const state = stateAfter(["2026-08-19T10:00:00", "2026-08-19T14:00:00", "2026-08-20T09:00:00"]);

    expect(state.todayCount).toBe(1);
    expect(state.totalCount).toBe(3);
  });

  it("하루를 건너뛰면 연속일이 다시 1부터예요", () => {
    const state = stateAfter(["2026-08-19T10:00:00", "2026-08-21T10:00:00"]);

    expect(state.streakDays).toBe(1);
  });

  it("이어서 온 날만큼 연속일이 쌓여요", () => {
    const state = stateAfter([
      "2026-08-19T10:00:00",
      "2026-08-20T10:00:00",
      "2026-08-21T10:00:00",
    ]);

    expect(state.streakDays).toBe(3);
  });

  it("하루에 여러 번 열어도 연속일은 하루치만 올라가요", () => {
    const state = stateAfter([
      "2026-08-19T10:00:00",
      "2026-08-20T09:00:00",
      "2026-08-20T11:00:00",
      "2026-08-20T18:00:00",
    ]);

    expect(state.streakDays).toBe(2);
  });

  it("본 대사는 도감에 쌓이고 같은 대사를 또 봐도 중복되지 않아요", () => {
    const first = registerVisit(EMPTY_STATE, at("2026-08-19T10:00:00"), 0);
    const second = registerVisit(first.state, at("2026-08-20T10:00:00"), 0);

    expect(first.isNewLine).toBe(true);
    expect(second.isNewLine).toBe(false);
    expect(second.state.seenLineIds).toHaveLength(1);
  });
});

describe("pickLine", () => {
  it("오늘 처음 열면 반겨줘요", () => {
    const line = pickLine({ todayCount: 1, totalCount: 1, sinceLastMs: null, hour: 10 }, 0);

    expect(line.mood).toBe("happy");
  });

  it("열여섯 번 넘게 열면 드러누워요", () => {
    const line = pickLine({ todayCount: 16, totalCount: 40, sinceLastMs: 60_000, hour: 10 }, 0);

    expect(line.mood).toBe("dead");
  });

  it("닫자마자 다시 열면 방금 갔다고 해요", () => {
    const line = pickLine({ todayCount: 2, totalCount: 2, sinceLastMs: 3_000, hour: 10 }, 0);

    expect(line.id.startsWith("i")).toBe(true);
  });

  it("일주일 넘게 안 오면 오랜만이라고 해요", () => {
    const eightDays = 8 * 24 * 60 * 60 * 1000;
    const line = pickLine({ todayCount: 1, totalCount: 5, sinceLastMs: eightDays, hour: 10 }, 0);

    expect(line.id.startsWith("c")).toBe(true);
  });

  it("기념일은 다른 어떤 대사보다 먼저예요", () => {
    // 100번째면서 동시에 오늘 스무 번째라도 기념일이 나와야 해요.
    const line = pickLine({ todayCount: 20, totalCount: 100, sinceLastMs: 60_000, hour: 10 }, 0);

    expect(line.id).toBe("m100");
  });

  it("새벽이어도 그날 여러 번째면 새벽 대사를 쓰지 않아요", () => {
    const line = pickLine({ todayCount: 5, totalCount: 5, sinceLastMs: 60_000, hour: 3 }, 0);

    expect(line.id.startsWith("n")).toBe(false);
  });

  it("대사 id는 도감 전체에서 겹치지 않아요", () => {
    const ids = ALL_LINES.map((line) => line.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("dayKey", () => {
  it("로컬 날짜를 YYYY-MM-DD로 만들어요", () => {
    expect(dayKey(at("2026-08-19T23:30:00"))).toBe("2026-08-19");
  });
});

describe("pickTreatLine", () => {
  it("아직 안 들은 간식 대사를 먼저 줘요", () => {
    // t1을 이미 들었으면 다음 광고에서는 t1이 나오면 안 돼요.
    const line = pickTreatLine(["t1"], 0);

    expect(line.id).not.toBe("t1");
  });

  it("다 들었으면 그중에서 아무거나 골라요", () => {
    const allTreatIds = LINE_GROUPS.find((group) => group.title === "간식")!.lines.map((l) => l.id);
    const line = pickTreatLine(allTreatIds, 0);

    expect(allTreatIds).toContain(line.id);
  });

  it("남은 간식 대사가 있는지 알려줘요", () => {
    const allTreatIds = LINE_GROUPS.find((group) => group.title === "간식")!.lines.map((l) => l.id);

    expect(hasUnheardTreat([])).toBe(true);
    expect(hasUnheardTreat(allTreatIds)).toBe(false);
  });
});

describe("isFlopped", () => {
  it("서른 번째부터 드러누워요", () => {
    expect(isFlopped(29)).toBe(false);
    expect(isFlopped(30)).toBe(true);
    expect(isFlopped(120)).toBe(true);
  });

  it("몇 번 안 열었으면 앉아 있어요", () => {
    expect(isFlopped(0)).toBe(false);
    expect(isFlopped(15)).toBe(false);
  });
});
