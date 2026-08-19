/**
 * 가이드 화면.
 *
 * 이 앱은 기능이 없어서 오히려 설명이 필요해요. 만질 수 있다는 걸 모르면
 * 그냥 열었다 닫는 앱이 되고, 도감이 왜 안 채워지는지도 알 수 없어요.
 *
 * 다만 대사 자체는 적지 않아요. 무슨 말을 하는지 미리 알아버리면 도감을 채울
 * 이유가 사라져요. "어떻게 하면 나오는지"까지만 알려주고 내용은 가려둬요.
 */

import { BannerSlot } from "../components/BannerSlot";
import { useVisit } from "../hooks/useVisit";
import { LINE_GROUPS, TOTAL_LINE_COUNT } from "../lib/lines";
import "./GuidePage.css";

interface Touch {
  emoji: string;
  title: string;
  body: string;
}

const TOUCHES: Touch[] = [
  {
    emoji: "🫳",
    title: "머리 쓰다듬기",
    body: "머리 위에 손가락을 대고 좌우로 문질러요. 눈을 가늘게 뜨고 그르렁대요.",
  },
  {
    emoji: "👆",
    title: "코 꾹 누르기",
    body: "코를 누르면 얼굴이 눌려요. 꾹 누르고 있으면 더 눌려요.",
  },
  {
    emoji: "🤲",
    title: "배 문지르기",
    body: "배를 좌우로 문질러요. 이 앱에서 뚱냥이가 제일 약해지는 자리예요.",
  },
  {
    emoji: "🐾",
    title: "발바닥 누르기",
    body: "앞발을 누르면 젤리가 눌려요.",
  },
];

export function GuidePage() {
  const { state } = useVisit();
  const collected = state.seenLineIds.length;

  return (
    <div className="page">
      <h1 className="page-title">가이드</h1>

      <div className="card">
        <div className="card-label">이 앱이 하는 일</div>
        <p className="muted">
          열면 뚱냥이가 한마디 해요. 그게 전부예요. 대신 자주 열수록 시큰둥해져요.
          하루에 처음 열면 반겨주고, 네 번째쯤부터 지겨워하고, 열여섯 번을 넘기면
          드러누워서 말을 안 해요.
        </p>
      </div>

      <div className="card">
        <div className="card-label">만져보세요</div>
        <ul className="touch-list">
          {TOUCHES.map((touch) => (
            <li key={touch.title} className="touch-item">
              <span className="touch-emoji" aria-hidden="true">
                {touch.emoji}
              </span>
              <div>
                <p className="touch-title">{touch.title}</p>
                <p className="muted">{touch.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="card-label">
          도감 채우기 · {collected}/{TOTAL_LINE_COUNT}
        </div>
        <p className="muted">
          들은 말은 도감에 쌓여요. 아직 못 들은 말은 가려져 있고, 어떤 상황에서
          나오는지 힌트만 보여줘요. 남은 칸을 채우려면 그 상황을 직접 만들어야 해요.
        </p>

        <ul className="condition-list">
          {LINE_GROUPS.map((group) => {
            const seen = group.lines.filter((line) => state.seenLineIds.includes(line.id)).length;
            return (
              <li key={group.title} className="condition-item">
                <span className="condition-title">{group.title}</span>
                <span className="condition-hint">{group.hint}</span>
                <span className="condition-count">
                  {seen}/{group.lines.length}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card">
        <div className="card-label">간식</div>
        <p className="muted">
          간식을 주면 뚱냥이가 잠깐 누그러지면서 간식일 때만 하는 말을 해요.
          광고를 끝까지 본 경우에만 열리고, 중간에 닫으면 아무 일도 없어요.
          이미 들은 말은 건너뛰고 아직 못 들은 말부터 줘요.
        </p>
      </div>

      <div className="card">
        <div className="card-label">기록</div>
        <p className="muted">
          몇 번 열었는지와 어떤 말을 들었는지만 기기 안에 저장해요. 서버로 보내지
          않고 로그인도 받지 않아요. 설정에서 기록을 지우면 도감도 함께 비워져요.
        </p>
      </div>

      <BannerSlot />
    </div>
  );
}
