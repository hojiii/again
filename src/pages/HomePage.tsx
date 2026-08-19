/**
 * 메인 화면.
 *
 * 캐릭터와 이번에 받은 한마디가 전부예요. 그 아래에 오늘 몇 번 왔는지,
 * 며칠째 오는지를 담담하게 적어둬요 — 자주 올수록 이 숫자가 커지는 게
 * 놀림의 근거가 되고, 동시에 화면에 스크롤이 생겨 배너를 놓을 자리가 돼요.
 */

import { BannerSlot } from "../components/BannerSlot";
import { Cat } from "../components/Cat";
import { LyingCat } from "../components/LyingCat";
import { useAdFree } from "../hooks/useAdFree";
import { LIVE_REWARDED_AD_GROUP_ID, useRewardedAd } from "../hooks/useRewardedAd";
import { useVisit } from "../hooks/useVisit";
import { TOTAL_LINE_COUNT, hasUnheardTreat } from "../lib/lines";
import { isFlopped } from "../lib/visits";
import "./HomePage.css";

/** 오늘 몇 번 왔는지에 붙는 한 줄 논평이에요. */
function todayNote(count: number): string {
  if (count <= 1) return "오늘은 아직 한 번이에요";
  if (count <= 3) return "적당해요";
  if (count <= 7) return "좀 많은데요";
  if (count <= 15) return "많이 심심하신가 봐요";
  return "이 정도면 저를 키우시는 거예요";
}

export function HomePage() {
  const { state, line, isNewLine, loading, giveTreat, pokeNose, pet, rubBelly, pressPaw } = useVisit();
  const { adFree } = useAdFree();

  // 광고를 지운 사람에게는 간식 버튼을 아예 띄우지 않아요. 보여줄 광고가 없으니까요.
  const treatAd = useRewardedAd(adFree ? null : LIVE_REWARDED_AD_GROUP_ID);

  if (loading || line == null) {
    return (
      <main className="page">
        <div className="stage" />
      </main>
    );
  }

  const collected = state.seenLineIds.length;

  return (
    <main className="page">
      <div className="stage">
        {/*
          서른 번을 넘기면 앉은 자세를 버리고 드러누워요. 만지는 규칙은 두 자세가
          같아서 넘기는 콜백도 같아요.
        */}
        {isFlopped(state.todayCount) ? (
          <LyingCat
            onPokeNose={pokeNose}
            onPet={pet}
            onBellyRub={rubBelly}
            onPawPress={pressPaw}
          />
        ) : (
          <Cat
            mood={line.mood}
            onPokeNose={pokeNose}
            onPet={pet}
            onBellyRub={rubBelly}
            onPawPress={pressPaw}
          />
        )}

        <p className="speech" key={line.id}>
          {line.text}
        </p>

        <p className="today-note">{todayNote(state.todayCount)}</p>

        <p className="touch-hint">머리 쓰다듬기 · 코 꾹 · 배 문지르기 · 발바닥 🐾</p>

        {isNewLine && <p className="new-badge">처음 듣는 말이에요 · 도감에 담겼어요</p>}

        {/*
          광고가 준비됐을 때만 보여줘요. 눌렀는데 아무 일도 안 나는 버튼은
          없느니만 못해요. 보상은 광고를 끝까지 본 경우에만 지급돼요.
        */}
        {treatAd.ready && (
          <button
            type="button"
            className="treat-button"
            disabled={treatAd.watching}
            onClick={() => treatAd.show(giveTreat)}
          >
            {treatAd.watching
              ? "간식 주는 중…"
              : hasUnheardTreat(state.seenLineIds)
                ? "🍗 간식 주고 새 말 듣기"
                : "🍗 간식 주기"}
          </button>
        )}
      </div>

      {/*
        숫자 넷을 카드 하나에 가로로 담아요. 예전에는 카드를 넷으로 쌓았는데
        그러면 배너가 첫 화면 밖으로 밀려나서 스크롤해야 보였어요. 놀리는 문구는
        말풍선 아래로 옮겨서 재미는 남기고 높이만 줄였어요.
      */}
      <section className="facts">
        <div className="fact">
          <span className="fact-label">오늘</span>
          <span className="fact-value">{state.todayCount}번</span>
        </div>
        <div className="fact">
          <span className="fact-label">전부</span>
          <span className="fact-value">{state.totalCount.toLocaleString("ko-KR")}</span>
        </div>
        <div className="fact">
          <span className="fact-label">연속</span>
          <span className="fact-value">{state.streakDays}일</span>
        </div>
        <div className="fact">
          <span className="fact-label">모은 말</span>
          <span className="fact-value">
            {collected}
            <span className="fact-total">/{TOTAL_LINE_COUNT}</span>
          </span>
        </div>
      </section>

      <BannerSlot />
    </main>
  );
}
