/**
 * 캐릭터 "뚱냥이".
 *
 * 빵빵한 볼, 짧은 주둥이, 큰 눈, 작고 둥근 귀. 치즈 태비 단모종의 인상을 잡았어요.
 * 잘생기게 그리지 않았어요. 살짝 심통난 얼굴이 이 앱의 톤과 맞아요.
 *
 * 사진처럼 털 한 올까지 그리는 건 SVG로 안 돼요. 대신 그라디언트로 볼륨을 만들고,
 * 볼·눈·코의 비율과 수염 자국 같은 디테일로 인상을 맞춰요. path 를 수백 개 쓰면
 * 사진에 가까워지겠지만 찌부와 쓰다듬기 애니메이션이 버벅여요.
 *
 * 만질 수 있어요. 코를 누르면 얼굴이 찌부되고, 몸을 문지르면 눈을 감아요.
 * 3D 대신 SVG로 하는 건 번들 때문이에요 — three.js 하나가 앱 전체보다 커요.
 * 찌부와 쓰다듬기 정도는 SVG 변형으로 충분히 표현돼요.
 */

import { useEffect, useRef, useState } from "react";
import type { Mood } from "../lib/lines";
import "./Cat.css";

/**
 * 기분마다 자세가 달라져요.
 *
 * 몸은 앉은 자세의 아래쪽 덩어리, 머리는 그 위에 얹힌 원이에요. 지칠수록 몸이
 * 옆으로 퍼지고 머리가 몸에 파묻혀요 — 목이 짧아지면서 주저앉는 모양이에요.
 */
const POSE: Record<Mood, { bodyRx: number; bodyRy: number; bodyCy: number; headR: number; headCy: number }> = {
  happy: { bodyRx: 74, bodyRy: 54, bodyCy: 176, headR: 58, headCy: 108 },
  neutral: { bodyRx: 77, bodyRy: 53, bodyCy: 178, headR: 58, headCy: 112 },
  bored: { bodyRx: 83, bodyRy: 50, bodyCy: 182, headR: 57, headCy: 120 },
  annoyed: { bodyRx: 90, bodyRy: 46, bodyCy: 186, headR: 56, headCy: 130 },
  dead: { bodyRx: 104, bodyRy: 36, bodyCy: 196, headR: 54, headCy: 152 },
};

/** 눈이 얼마나 떠 있는지예요. 0이면 감은 거예요. */
const OPENNESS: Record<Mood, number> = {
  happy: 0.92,
  neutral: 1,
  bored: 0.62,
  annoyed: 0.4,
  dead: 0,
};

interface Props {
  mood: Mood;
  size?: number;
  /** 코를 눌렀을 때 불려요. */
  onPokeNose?: () => void;
  /** 몸을 문질렀을 때 불려요. 연속으로 문질러도 자주 불리지 않아요. */
  onPet?: () => void;
}

export function Cat({ mood, size = 260, onPokeNose, onPet }: Props) {
  const [squished, setSquished] = useState(false);
  const [petting, setPetting] = useState(false);

  // 쓰다듬기는 손가락이 일정 거리 이상 움직였을 때만 쳐요. 그냥 탭한 걸
  // 쓰다듬었다고 하면 코를 누르려다 빗나간 것까지 쓰다듬기가 돼요.
  const strokeDistance = useRef(0);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const petCooldown = useRef(0);
  const squishTimer = useRef<number | null>(null);
  const petTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (squishTimer.current != null) window.clearTimeout(squishTimer.current);
      if (petTimer.current != null) window.clearTimeout(petTimer.current);
    };
  }, []);

  function pokeNose() {
    setSquished(true);
    if (squishTimer.current != null) window.clearTimeout(squishTimer.current);
    squishTimer.current = window.setTimeout(() => setSquished(false), 420);
    onPokeNose?.();
  }

  function handleMove(x: number, y: number) {
    const last = lastPoint.current;
    lastPoint.current = { x, y };
    if (last == null) return;

    strokeDistance.current += Math.hypot(x - last.x, y - last.y);
    if (strokeDistance.current < 90) return;

    strokeDistance.current = 0;

    // 문지르는 내내 대사가 쏟아지면 정신없어요. 최소 간격을 둬요.
    const now = Date.now();
    if (now - petCooldown.current < 1400) return;
    petCooldown.current = now;

    setPetting(true);
    if (petTimer.current != null) window.clearTimeout(petTimer.current);
    petTimer.current = window.setTimeout(() => setPetting(false), 1200);
    onPet?.();
  }

  function endStroke() {
    lastPoint.current = null;
    strokeDistance.current = 0;
  }

  const pose = POSE[mood];
  const rx = pose.bodyRx;
  const ry = pose.bodyRy;
  const cy = pose.bodyCy;

  // 코를 누르면 머리만 눌려요. 몸까지 같이 움직이면 찌부가 아니라 통째로 흔들려요.
  const headRx = squished ? pose.headR * 1.12 : pose.headR;
  const headRy = squished ? pose.headR * 0.86 : pose.headR;
  const headCy = squished ? pose.headCy + 7 : pose.headCy;

  // 쓰다듬는 중에는 기분과 상관없이 눈을 가늘게 떠요.
  const openness = petting ? 0.15 : OPENNESS[mood];
  const eyeY = headCy - headRy * 0.1;
  const noseY = eyeY + 30;

  return (
    <svg
      className={[
        "cat",
        `is-${mood}`,
        squished ? "is-squished" : "",
        petting ? "is-petting" : "",
      ].filter(Boolean).join(" ")}
      width={size}
      height={size * 0.92}
      viewBox="0 0 260 240"
      role="img"
      aria-label="뚱냥이"
      onPointerDown={(event) => {
        lastPoint.current = { x: event.clientX, y: event.clientY };
        strokeDistance.current = 0;
      }}
      onPointerMove={(event) => {
        if (event.buttons === 0 && event.pointerType === "mouse") return;
        handleMove(event.clientX, event.clientY);
      }}
      onPointerUp={endStroke}
      onPointerLeave={endStroke}
    >
      <defs>
        {/* 몸통 볼륨 — 왼쪽 위에서 빛이 들어와요. */}
        <radialGradient id="catFur" cx="36%" cy="24%" r="82%">
          <stop offset="0%" stopColor="var(--cat-fur-light)" />
          <stop offset="52%" stopColor="var(--cat-fur)" />
          <stop offset="100%" stopColor="var(--cat-fur-dark)" />
        </radialGradient>

        {/* 얼굴 가운데와 가슴은 크림색으로 빠져요. 사진 속 치즈냥의 특징이에요. */}
        <radialGradient id="catBelly" cx="50%" cy="30%" r="74%">
          <stop offset="0%" stopColor="var(--cat-belly-light)" />
          <stop offset="100%" stopColor="var(--cat-belly)" />
        </radialGradient>

        {/* 볼 — 가장자리로 갈수록 몸통 색에 녹아들어요. */}
        <radialGradient id="catCheek" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="var(--cat-belly-light)" />
          <stop offset="70%" stopColor="var(--cat-belly)" />
          <stop offset="100%" stopColor="var(--cat-belly)" stopOpacity="0" />
        </radialGradient>

        {/* 눈동자 — 위가 어둡고 아래가 밝아야 구슬처럼 보여요. */}
        <radialGradient id="catIris" cx="50%" cy="62%" r="62%">
          <stop offset="0%" stopColor="var(--cat-iris-light)" />
          <stop offset="100%" stopColor="var(--cat-iris)" />
        </radialGradient>

        {/* 몸 아래쪽 그늘 */}
        <linearGradient id="catShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.13" />
        </linearGradient>

        <clipPath id="catBodyClip">
          <ellipse cx="130" cy={cy} rx={rx} ry={ry} />
        </clipPath>
      </defs>

      {/* 바닥 그림자 */}
      <ellipse className="cat-shadow" cx="130" cy={cy + ry - 2} rx={rx * 0.94} ry="12" />

      {/* 꼬리 — 몸 옆을 감아 앞으로 나와요 */}
      <path
        className="cat-tail"
        d={
          mood === "dead"
            ? `M${130 + rx - 6} ${cy + 6} q46 10 30 28`
            : `M${130 + rx - 8} ${cy + 10} q50 -2 34 -44`
        }
      />

      {/* 몸 — 앉은 자세의 아래쪽 덩어리 */}
      <ellipse className="cat-body" cx="130" cy={cy} rx={rx} ry={ry} />

      {/* 가슴의 크림색 */}
      <ellipse className="cat-belly" cx="130" cy={cy + ry * 0.2} rx={rx * 0.52} ry={ry * 0.72} />

      {/* 등 줄무늬 */}
      <g className="cat-stripes" clipPath="url(#catBodyClip)">
        <path d={`M${130 - rx * 0.86} ${cy - 12} q20 8 30 6`} />
        <path d={`M${130 + rx * 0.86} ${cy - 12} q-20 8 -30 6`} />
        <path d={`M${130 - rx * 0.8} ${cy + 10} q18 8 28 6`} />
        <path d={`M${130 + rx * 0.8} ${cy + 10} q-18 8 -28 6`} />
      </g>

      <ellipse className="cat-shade" cx="130" cy={cy} rx={rx} ry={ry} clipPath="url(#catBodyClip)" />

      {/* 앞발 — 사진처럼 몸 앞으로 모아요 */}
      <g className="cat-paws">
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={130 + side * rx * 0.38} cy={cy + ry - 6} rx="24" ry="13" />
            <g className="cat-toe">
              <path d={`M${130 + side * rx * 0.38 - 8} ${cy + ry - 13} v8`} />
              <path d={`M${130 + side * rx * 0.38 + 1} ${cy + ry - 14} v9`} />
              <path d={`M${130 + side * rx * 0.38 + 10} ${cy + ry - 13} v8`} />
            </g>
          </g>
        ))}
      </g>

      {/* 귀 — 머리 위에 작고 둥글게 */}
      {[-1, 1].map((side) => {
        const ex = 130 + side * headRx * 0.66;
        const ey = headCy - headRy * 0.66;
        return (
          <g key={side}>
            <path
              className="cat-ear"
              d={`M${ex} ${ey + 16} q${side * -4} -24 ${side * 15} -27 q${side * 19} -2 ${side * 20} 19 q${side * -15} 11 ${side * -35} 8z`}
            />
            <path
              className="cat-ear-inner"
              d={`M${ex + side * 2} ${ey + 13} q${side * -2} -15 ${side * 10} -18 q${side * 12} -1 ${side * 13} 12 q${side * -9} 6 ${side * -23} 6z`}
            />
          </g>
        );
      })}

      {/* 머리 */}
      <ellipse className="cat-head" cx="130" cy={headCy} rx={headRx} ry={headRy} />

      {/* 이마 M자 태비 */}
      <g className="cat-stripes">
        <path d={`M130 ${headCy - headRy * 0.86} v18`} />
        <path d={`M${130 - 14} ${headCy - headRy * 0.82} q3 10 5 17`} />
        <path d={`M${130 + 14} ${headCy - headRy * 0.82} q-3 10 -5 17`} />
        <path d={`M${130 - 28} ${headCy - headRy * 0.68} q4 9 8 14`} />
        <path d={`M${130 + 28} ${headCy - headRy * 0.68} q-4 9 -8 14`} />
      </g>

      {/* 볼 — 이 품종의 인상을 만드는 부분이에요 */}
      <ellipse className="cat-cheek" cx={130 - 32} cy={noseY} rx="30" ry="24" />
      <ellipse className="cat-cheek" cx={130 + 32} cy={noseY} rx="30" ry="24" />

      {/* 눈 */}
      {openness <= 0.02 ? (
        <g className="cat-line">
          <path d={`M${130 - 36} ${eyeY} q14 12 28 0`} />
          <path d={`M${130 + 8} ${eyeY} q14 12 28 0`} />
        </g>
      ) : (
        <g>
          {[130 - 22, 130 + 22].map((cx) => (
            <g key={cx}>
              <ellipse className="cat-eye-rim" cx={cx} cy={eyeY} rx="18" ry={18 * openness} />
              <ellipse className="cat-eye-white" cx={cx} cy={eyeY} rx="16" ry={16 * openness} />
              <ellipse className="cat-iris" cx={cx} cy={eyeY} rx="14" ry={14 * openness} />
              <ellipse className="cat-pupil" cx={cx} cy={eyeY} rx="7" ry={12 * openness} />
              <circle className="cat-glint" cx={cx - 5.5} cy={eyeY - 5.5 * openness} r={3.6 * openness + 1} />
              <circle className="cat-glint-sm" cx={cx + 5.5} cy={eyeY + 5.5 * openness} r={1.8 * openness} />
            </g>
          ))}
          {openness < 0.95 && (
            <g className="cat-lid">
              <ellipse cx={130 - 22} cy={eyeY - 18} rx="19" ry={18 * (1 - openness) + 2} />
              <ellipse cx={130 + 22} cy={eyeY - 18} rx="19" ry={18 * (1 - openness) + 2} />
            </g>
          )}
        </g>
      )}

      {/* 코 */}
      <path className="cat-nose" d={`M${130 - 8} ${noseY - 5} q8 -3 16 0 q-3 8 -8 11 q-5 -3 -8 -11z`} />
      <path className="cat-nose-line" d={`M130 ${noseY + 6} v5`} />

      {/* 입 */}
      <g className="cat-line cat-mouth">
        {mood === "dead" ? (
          <path d={`M${130 - 7} ${noseY + 12} h14`} />
        ) : (
          <>
            <path d={`M130 ${noseY + 11} q-10 8 -18 1`} />
            <path d={`M130 ${noseY + 11} q10 8 18 1`} />
          </>
        )}
      </g>

      {/* 수염 자국 점 */}
      <g className="cat-dots">
        {[-1, 1].map((side) =>
          [0, 1, 2].map((row) => (
            <circle
              key={`${side}-${row}`}
              cx={130 + side * (19 + (row % 2) * 8)}
              cy={noseY + row * 6}
              r="1.5"
            />
          )),
        )}
      </g>

      {/* 수염 */}
      <g className="cat-whisker">
        <path d={`M${130 - 42} ${noseY - 2} q-32 -8 -50 -15`} />
        <path d={`M${130 - 42} ${noseY + 6} q-34 0 -54 1`} />
        <path d={`M${130 - 42} ${noseY + 14} q-32 9 -48 17`} />
        <path d={`M${130 + 42} ${noseY - 2} q32 -8 50 -15`} />
        <path d={`M${130 + 42} ${noseY + 6} q34 0 54 1`} />
        <path d={`M${130 + 42} ${noseY + 14} q32 9 48 17`} />
      </g>

      {/* 코를 정확히 짚기 어려우니 넉넉한 투명 원을 겹쳐요. */}
      <circle
        className="cat-nose-hit"
        cx="130"
        cy={noseY}
        r="26"
        onPointerDown={(event) => {
          event.stopPropagation();
          pokeNose();
        }}
      />
    </svg>
  );
}
