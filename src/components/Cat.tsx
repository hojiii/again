/**
 * 캐릭터 "뚱냥이".
 *
 * 선화 대신 **볼륨이 있는 그림**으로 그려요. 그라데이션으로 몸의 둥근 면을 만들고,
 * 고등어태비 줄무늬와 흰 배, 눈 하이라이트를 넣어요. 사진 같은 실사는 SVG로
 * 불가능하지만, 빛과 그림자가 있으면 "그려 넣은 도형"에서는 확실히 벗어나요.
 *
 * 자주 올수록 몸이 퍼지고 귀가 처지고 눈이 감겨요. 마지막엔 드러누워요.
 */

import type { Mood } from "../lib/lines";
import "./Cat.css";

/** 기분마다 몸 비율이 달라져요. 지칠수록 옆으로 퍼지고 낮아져요. */
const BODY: Record<Mood, { rx: number; ry: number; cy: number }> = {
  happy: { rx: 78, ry: 74, cy: 132 },
  neutral: { rx: 82, ry: 71, cy: 135 },
  bored: { rx: 88, ry: 66, cy: 140 },
  annoyed: { rx: 95, ry: 60, cy: 146 },
  dead: { rx: 108, ry: 44, cy: 162 },
};

/** 귀도 같이 처져요. */
const EARS: Record<Mood, { left: string; right: string; innerL: string; innerR: string }> = {
  happy: {
    left: "M62 74 L52 22 L104 56 Z",
    right: "M178 74 L188 22 L136 56 Z",
    innerL: "M68 70 L61 38 L94 60 Z",
    innerR: "M172 70 L179 38 L146 60 Z",
  },
  neutral: {
    left: "M62 78 L50 30 L103 60 Z",
    right: "M178 78 L190 30 L137 60 Z",
    innerL: "M68 74 L59 45 L93 63 Z",
    innerR: "M172 74 L181 45 L147 63 Z",
  },
  bored: {
    left: "M58 86 L38 46 L98 70 Z",
    right: "M182 86 L202 46 L142 70 Z",
    innerL: "M65 82 L49 59 L90 72 Z",
    innerR: "M175 82 L191 59 L150 72 Z",
  },
  annoyed: {
    left: "M54 96 L26 68 L94 82 Z",
    right: "M186 96 L214 68 L146 82 Z",
    innerL: "M62 92 L40 76 L88 84 Z",
    innerR: "M178 92 L200 76 L152 84 Z",
  },
  dead: {
    left: "M48 122 L10 116 L90 106 Z",
    right: "M192 122 L230 116 L150 106 Z",
    innerL: "M56 118 L26 114 L84 108 Z",
    innerR: "M184 118 L214 114 L156 108 Z",
  },
};

/** 눈 중심 좌표예요. 몸이 낮아지면 얼굴도 같이 내려가요. */
const EYE_Y: Record<Mood, number> = {
  happy: 122,
  neutral: 125,
  bored: 130,
  annoyed: 137,
  dead: 152,
};

function Eyes({ mood }: { mood: Mood }) {
  const y = EYE_Y[mood];

  if (mood === "happy") {
    // 기분 좋을 때 고양이 눈은 반달로 접혀요.
    return (
      <g className="cat-line">
        <path d={`M74 ${y} q13 -15 26 0`} />
        <path d={`M140 ${y} q13 -15 26 0`} />
      </g>
    );
  }

  if (mood === "dead") {
    return (
      <g className="cat-line">
        <path d={`M74 ${y} q13 11 26 0`} />
        <path d={`M140 ${y} q13 11 26 0`} />
      </g>
    );
  }

  // 뜬 눈 — 홍채, 세로 동공, 하이라이트를 겹쳐요.
  const openness = mood === "neutral" ? 1 : mood === "bored" ? 0.66 : 0.4;
  const ry = 15 * openness;
  const pupilRy = 11 * openness;

  return (
    <g>
      {[87, 153].map((cx) => (
        <g key={cx}>
          <ellipse className="cat-eye-white" cx={cx} cy={y} rx="15" ry={ry} />
          <ellipse className="cat-iris" cx={cx} cy={y} rx="12.5" ry={ry * 0.92} />
          <ellipse className="cat-pupil" cx={cx} cy={y} rx="4.4" ry={pupilRy} />
          <circle className="cat-glint" cx={cx - 4.5} cy={y - ry * 0.35} r={2.6 * openness + 1} />
          <circle className="cat-glint-sm" cx={cx + 5} cy={y + ry * 0.3} r={1.5 * openness} />
        </g>
      ))}

      {/* 반쯤 감겼을 때 위 눈꺼풀을 덮어요. */}
      {mood !== "neutral" && (
        <g className="cat-lid">
          <ellipse cx="87" cy={y - 15 - (1 - openness) * -13} rx="16" ry={15 * (1 - openness) + 2} />
          <ellipse cx="153" cy={y - 15 - (1 - openness) * -13} rx="16" ry={15 * (1 - openness) + 2} />
        </g>
      )}
    </g>
  );
}

function Muzzle({ mood }: { mood: Mood }) {
  const y = EYE_Y[mood] + (mood === "dead" ? 20 : 30);

  return (
    <g>
      {/* 주둥이 두 덩이 */}
      <ellipse className="cat-muzzle" cx="107" cy={y + 6} rx="20" ry="14" />
      <ellipse className="cat-muzzle" cx="133" cy={y + 6} rx="20" ry="14" />

      {/* 코 */}
      <path className="cat-nose" d={`M111 ${y - 4} h18 l-9 10 z`} />
      <path className="cat-nose-glint" d={`M114 ${y - 2} h7`} />

      {/* 입 */}
      <g className="cat-line cat-mouth">
        {mood === "dead" ? (
          <path d={`M120 ${y + 6} v3`} />
        ) : (
          <>
            <path d={`M120 ${y + 6} v4`} />
            <path d={`M120 ${y + 10} q-9 8 -16 1`} />
            <path d={`M120 ${y + 10} q9 8 16 1`} />
          </>
        )}
      </g>

      {/* 수염 — 주둥이 옆에서 뻗어요 */}
      <g className="cat-whisker">
        <path d={`M84 ${y + 1} q-30 -6 -46 -12`} />
        <path d={`M84 ${y + 7} q-32 1 -50 2`} />
        <path d={`M84 ${y + 13} q-30 8 -46 16`} />
        <path d={`M156 ${y + 1} q30 -6 46 -12`} />
        <path d={`M156 ${y + 7} q32 1 50 2`} />
        <path d={`M156 ${y + 13} q30 8 46 16`} />
      </g>
    </g>
  );
}

export function Cat({ mood }: { mood: Mood }) {
  const body = BODY[mood];
  const ears = EARS[mood];
  const top = body.cy - body.ry;

  return (
    <svg className={`cat is-${mood}`} viewBox="0 0 240 230" role="img" aria-label="뚱냥이">
      <defs>
        {/* 몸 볼륨 — 왼쪽 위에서 빛이 들어와요. */}
        <radialGradient id="catFur" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="var(--cat-fur-light)" />
          <stop offset="62%" stopColor="var(--cat-fur)" />
          <stop offset="100%" stopColor="var(--cat-fur-dark)" />
        </radialGradient>

        <radialGradient id="catBelly" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="var(--cat-belly-light)" />
          <stop offset="100%" stopColor="var(--cat-belly)" />
        </radialGradient>

        <linearGradient id="catEarInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cat-ear-inner-light)" />
          <stop offset="100%" stopColor="var(--cat-ear-inner)" />
        </linearGradient>

        {/* 몸 밖으로 삐져나온 줄무늬를 잘라내요. */}
        <clipPath id="catBodyClip">
          <ellipse cx="120" cy={body.cy} rx={body.rx} ry={body.ry} />
        </clipPath>
      </defs>

      {/* 바닥 그림자 */}
      <ellipse className="cat-shadow" cx="120" cy={body.cy + body.ry - 4} rx={body.rx * 0.88} ry="11" />

      {/* 꼬리 */}
      <path
        className="cat-tail"
        d={
          mood === "dead"
            ? "M222 176 q22 4 14 18"
            : `M${120 + body.rx - 6} ${body.cy + 18} q40 -8 30 -52`
        }
      />

      {/* 귀 */}
      <path className="cat-ear" d={ears.left} />
      <path className="cat-ear" d={ears.right} />
      <path className="cat-ear-inner" d={ears.innerL} />
      <path className="cat-ear-inner" d={ears.innerR} />

      {/* 몸 */}
      <ellipse className="cat-body" cx="120" cy={body.cy} rx={body.rx} ry={body.ry} />

      {/* 배 */}
      <ellipse
        className="cat-belly"
        cx="120"
        cy={body.cy + body.ry * 0.36}
        rx={body.rx * 0.52}
        ry={body.ry * 0.5}
      />

      {/* 태비 줄무늬 — 이마와 등에만 얹어요. */}
      <g className="cat-stripes" clipPath="url(#catBodyClip)">
        <path d={`M120 ${top + 4} v22`} />
        <path d={`M100 ${top + 10} q4 12 8 20`} />
        <path d={`M140 ${top + 10} q-4 12 -8 20`} />
        <path d={`M${120 - body.rx * 0.82} ${body.cy - 6} q16 6 26 4`} />
        <path d={`M${120 + body.rx * 0.82} ${body.cy - 6} q-16 6 -26 4`} />
        <path d={`M${120 - body.rx * 0.78} ${body.cy + 16} q16 6 26 4`} />
        <path d={`M${120 + body.rx * 0.78} ${body.cy + 16} q-16 6 -26 4`} />
      </g>

      {/* 앞발 */}
      <g className="cat-paws">
        <ellipse cx={120 - body.rx * 0.42} cy={body.cy + body.ry - 8} rx="21" ry="12" />
        <ellipse cx={120 + body.rx * 0.42} cy={body.cy + body.ry - 8} rx="21" ry="12" />
        <g className="cat-toe">
          <path d={`M${120 - body.rx * 0.42 - 6} ${body.cy + body.ry - 14} v7`} />
          <path d={`M${120 - body.rx * 0.42 + 6} ${body.cy + body.ry - 14} v7`} />
          <path d={`M${120 + body.rx * 0.42 - 6} ${body.cy + body.ry - 14} v7`} />
          <path d={`M${120 + body.rx * 0.42 + 6} ${body.cy + body.ry - 14} v7`} />
        </g>
      </g>

      <Eyes mood={mood} />
      <Muzzle mood={mood} />
    </svg>
  );
}
