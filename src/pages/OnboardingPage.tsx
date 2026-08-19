/**
 * 첫 사용 안내.
 *
 * 이 앱은 기능이 없어서 처음 열면 뭘 해야 할지 알 수 없어요. 만질 수 있다는
 * 것만 알려주면 나머지는 알아서 찾아요.
 *
 * 대사는 보여주지 않아요. 미리 알아버리면 도감을 채울 이유가 없어져요.
 * 건너뛰기는 항상 열어둬요 — 이미 아는 사람을 붙잡아두면 안 돼요.
 */

import { useState } from "react";
import { Cat } from "../components/Cat";
import { TOTAL_LINE_COUNT } from "../lib/lines";
import type { Mood } from "../lib/lines";
import "./OnboardingPage.css";

interface Step {
  mood: Mood;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    mood: "happy",
    title: "열면 한마디 해요",
    body: "그게 이 앱의 전부예요. 뚱냥이는 아무것도 해주지 않아요.",
  },
  {
    mood: "annoyed",
    title: "자주 열수록 시큰둥해져요",
    body: "하루에 처음 열면 반겨주고, 네 번째쯤부터 지겨워하고, 열여섯 번을 넘기면 드러누워서 말을 안 해요.",
  },
  {
    mood: "neutral",
    title: "만질 수 있어요",
    body: "머리를 쓰다듬고, 코를 꾹 누르고, 배를 문지르고, 앞발을 눌러보세요. 자리마다 하는 말이 달라요.",
  },
  {
    mood: "bored",
    title: `들은 말은 도감에 쌓여요`,
    body: `모두 ${TOTAL_LINE_COUNT}개예요. 못 들은 말은 가려져 있고 어떤 상황에서 나오는지 힌트만 보여줘요.`,
  },
];

export function OnboardingPage({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  return (
    <div className="page onboarding">
      <button type="button" className="onboarding-skip" onClick={onDone}>
        건너뛰기
      </button>

      <div className="onboarding-art">
        {/*
          안내 중에도 진짜 뚱냥이예요. 눌러보면 반응해요. 다만 이 화면은 기록
          Provider 바깥이라 대사는 나오지 않아요 — 안내를 보다가 도감이 채워지면
          "직접 찾아내는" 재미가 먼저 새어나가요.
        */}
        <Cat mood={step.mood} />
      </div>

      <h1 className="onboarding-title">{step.title}</h1>
      <p className="onboarding-body">{step.body}</p>

      <div className="onboarding-dots" aria-hidden="true">
        {STEPS.map((item, dotIndex) => (
          <span
            key={item.title}
            className={dotIndex === index ? "onboarding-dot is-active" : "onboarding-dot"}
          />
        ))}
      </div>

      <div className="onboarding-actions">
        {index > 0 && (
          <button type="button" className="btn btn-secondary" onClick={() => setIndex(index - 1)}>
            이전
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary onboarding-next"
          onClick={() => (isLast ? onDone() : setIndex(index + 1))}
        >
          {isLast ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
