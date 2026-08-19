/**
 * 캐릭터 "뚱냥이" — 스코티시 폴드.
 *
 * 그림과 인터랙션 설계는 사용자가 그린 SVG를 그대로 가져왔어요. 레이어가 id로
 * 나뉘어 있어서 부위별로 따로 움직일 수 있고, 그 위에 이 앱에만 필요한 것을 얹었어요.
 *
 * 얹은 것은 **기분(mood)** 이에요. 원본에는 표정 변화가 없는데, 이 앱은 자주 열수록
 * 뚱냥이가 시큰둥해지는 게 핵심이라 눈·귀·입이 기분을 따라 움직여야 해요. 부위가
 * 나뉘어 있으니 CSS 변형만으로 처리하고 그림 자체는 건드리지 않았어요.
 *
 * 만질 수 있는 곳은 네 군데예요. 머리(쓰다듬기), 코(꾹 누르기), 배(문지르기),
 * 앞발(누르기). 각각 전용 대사가 있고 도감에 따로 쌓여요.
 */

import { useEffect, useRef, useState } from "react";
import type { Mood } from "../lib/lines";
import "./Cat.css";

interface Props {
  mood: Mood;
  /** 머리를 쓰다듬었을 때 불려요. */
  onPet?: () => void;
  /** 코를 눌렀을 때 불려요. */
  onPokeNose?: () => void;
  /** 배를 문질렀을 때 불려요. */
  onBellyRub?: () => void;
  /** 앞발을 눌렀을 때 불려요. */
  onPawPress?: () => void;
}

interface Heart {
  id: number;
  x: number;
  y: number;
}

/** 같은 곳을 계속 문질러도 대사가 쏟아지지 않게 두는 최소 간격이에요. */
const SPEAK_COOLDOWN_MS = 1300;

export function Cat({ mood, onPet, onPokeNose, onBellyRub, onPawPress }: Props) {
  const [petting, setPetting] = useState(false);
  const [squish, setSquish] = useState<"none" | "soft" | "deep">("none");
  const [bellyRubbing, setBellyRubbing] = useState(false);
  const [purring, setPurring] = useState(false);
  const [pressedPaw, setPressedPaw] = useState<"left" | "right" | null>(null);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const heartId = useRef(0);
  const lastX = useRef(0);
  const distance = useRef(0);
  const dragging = useRef<"head" | "belly" | null>(null);
  const spokeAt = useRef(0);

  const petTimer = useRef<number | null>(null);
  const bellyTimer = useRef<number | null>(null);
  const purrTimer = useRef<number | null>(null);
  const deepTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      [petTimer, bellyTimer, purrTimer, deepTimer].forEach((timer) => {
        if (timer.current != null) window.clearTimeout(timer.current);
      });
    };
  }, []);

  /** 하트를 하나 띄워요. 애니메이션이 끝나면 스스로 사라져요. */
  function spawnHeart(x: number, y: number) {
    const id = heartId.current++;
    setHearts((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 1300);
  }

  function purr(ms: number) {
    setPurring(true);
    if (purrTimer.current != null) window.clearTimeout(purrTimer.current);
    purrTimer.current = window.setTimeout(() => setPurring(false), ms);
  }

  /** 대사가 너무 자주 나오면 정신없어요. 간격을 두고 불러요. */
  function speak(say?: () => void) {
    const now = Date.now();
    if (now - spokeAt.current < SPEAK_COOLDOWN_MS) return;
    spokeAt.current = now;
    say?.();
  }

  function startDrag(target: "head" | "belly", event: React.PointerEvent) {
    dragging.current = target;
    lastX.current = event.clientX;
    distance.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent) {
    if (dragging.current == null) return;

    const delta = Math.abs(event.clientX - lastX.current);
    lastX.current = event.clientX;

    if (dragging.current === "head") {
      distance.current += delta;
      if (distance.current <= 24) return;
      distance.current = 0;

      setPetting(true);
      purr(900);
      if (petTimer.current != null) window.clearTimeout(petTimer.current);
      petTimer.current = window.setTimeout(() => setPetting(false), 700);
      if (Math.random() > 0.55) spawnHeart(280 + (Math.random() * 80 - 40), 190);
      speak(onPet);
      return;
    }

    if (delta <= 8) return;
    setBellyRubbing(true);
    purr(800);
    if (bellyTimer.current != null) window.clearTimeout(bellyTimer.current);
    bellyTimer.current = window.setTimeout(() => setBellyRubbing(false), 700);
    if (Math.random() > 0.68) spawnHeart(280 + (Math.random() * 100 - 50), 390);
    speak(onBellyRub);
  }

  function endDrag() {
    dragging.current = null;
    distance.current = 0;
  }

  function pressNose(event: React.PointerEvent) {
    event.stopPropagation();
    setPetting(false);
    setSquish("soft");
    speak(onPokeNose);

    // 오래 누르고 있으면 더 눌려요.
    if (deepTimer.current != null) window.clearTimeout(deepTimer.current);
    deepTimer.current = window.setTimeout(() => {
      setSquish("deep");
      spawnHeart(280, 160);
    }, 420);
  }

  function releaseNose() {
    if (deepTimer.current != null) window.clearTimeout(deepTimer.current);
    setSquish("none");
  }

  function pressPaw(side: "left" | "right", event: React.PointerEvent) {
    event.stopPropagation();
    setPressedPaw(side);
    purr(450);
    spawnHeart(side === "left" ? 205 : 355, 480);
    speak(onPawPress);
  }

  const className = [
    "cat",
    `is-${mood}`,
    petting ? "is-pet" : "",
    squish === "soft" ? "is-squish" : "",
    squish === "deep" ? "is-squish is-deep" : "",
    bellyRubbing ? "is-belly" : "",
    purring ? "is-purring" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={className}
      viewBox="0 0 560 590"
      role="img"
      aria-label="뚱냥이"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <g id="tail" className="tailIdle">
        <path
          d="M389 438 C481 421 506 475 465 506 C435 528 408 496 432 478 C455 460 442 444 395 458"
          fill="none"
          stroke="#D88932"
          strokeWidth="34"
          strokeLinecap="round"
        />
      </g>

      <g id="body" className="breath">
        <ellipse cx="280" cy="445" rx="133" ry="110" fill="#E6A04B" />
        <ellipse cx="280" cy="463" rx="88" ry="74" fill="#FFD48A" />
        <ellipse cx="280" cy="453" rx="54" ry="48" fill="#FFE8B9" opacity=".65" />
      </g>

      <g id="pawL" className={pressedPaw === "left" ? "is-pressed" : undefined}>
        <ellipse cx="204" cy="522" rx="46" ry="27" fill="#F0B45F" />
        <ellipse cx="204" cy="522" rx="25" ry="16" fill="#dfc7c3" />
        <circle cx="187" cy="511" r="7" fill="#dfc7c3" />
        <circle cx="204" cy="507" r="7" fill="#dfc7c3" />
        <circle cx="221" cy="511" r="7" fill="#dfc7c3" />
      </g>

      <g id="pawR" className={pressedPaw === "right" ? "is-pressed" : undefined}>
        <ellipse cx="356" cy="522" rx="46" ry="27" fill="#F0B45F" />
        <ellipse cx="356" cy="522" rx="25" ry="16" fill="#dfc7c3" />
        <circle cx="339" cy="511" r="7" fill="#dfc7c3" />
        <circle cx="356" cy="507" r="7" fill="#dfc7c3" />
        <circle cx="373" cy="511" r="7" fill="#dfc7c3" />
      </g>

      <g id="head">
        <ellipse cx="280" cy="250" rx="151" ry="137" fill="#E6A04B" />
        <ellipse cx="280" cy="282" rx="111" ry="87" fill="#FFE0A3" />
      </g>

      <g id="ears">
        <path d="M160 197 C129 145 156 116 214 139 C193 148 179 169 174 199 Z" fill="#C97828" />
        <path d="M400 197 C431 145 404 116 346 139 C367 148 381 169 386 199 Z" fill="#C97828" />
        <path d="M168 175 C157 151 171 139 196 146 C183 155 176 165 172 178 Z" fill="#c9aaa7" opacity=".78" />
        <path d="M392 175 C403 151 389 139 364 146 C377 155 384 165 388 178 Z" fill="#c9aaa7" opacity=".78" />
      </g>

      <path
        d="M231 164 C253 147 271 148 280 164 C289 148 307 147 329 164"
        fill="none"
        stroke="#C97828"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* 치즈 태비 무늬 */}
      <g
        id="tabbyMarks"
        fill="none"
        stroke="#C97828"
        strokeWidth="10"
        strokeLinecap="round"
        opacity=".82"
        pointerEvents="none"
      >
        <path d="M247 176 Q260 190 266 208" />
        <path d="M280 168 L280 207" />
        <path d="M313 176 Q300 190 294 208" />
        <path d="M160 236 Q180 244 192 259" />
        <path d="M400 236 Q380 244 368 259" />
      </g>

      <g id="eyes" className="blink">
        <ellipse cx="222" cy="244" rx="26" ry="31" fill="#33312f" />
        <ellipse cx="338" cy="244" rx="26" ry="31" fill="#33312f" />
        <circle cx="214" cy="235" r="7" fill="#fff" opacity=".9" />
        <circle cx="330" cy="235" r="7" fill="#fff" opacity=".9" />
      </g>

      {/*
        기분이 가라앉으면 위 눈꺼풀이 내려와요. 눈 자체는 원본 그대로 두고 덮는
        방식이라, 그림을 고치지 않고도 표정을 만들 수 있어요.
      */}
      <g id="lids" pointerEvents="none">
        <ellipse cx="222" cy="244" rx="27" ry="32" fill="#E6A04B" />
        <ellipse cx="338" cy="244" rx="27" ry="32" fill="#E6A04B" />
      </g>

      <g id="cheeks">
        <ellipse cx="210" cy="311" rx="50" ry="37" fill="#FFE1A8" opacity=".97" />
        <ellipse cx="350" cy="311" rx="50" ry="37" fill="#FFE1A8" opacity=".97" />
      </g>

      <g id="nose">
        <path d="M260 286 Q280 272 300 286 Q297 306 280 309 Q263 306 260 286Z" fill="#b98383" />
      </g>

      <g id="mouth">
        <path
          d="M280 307 C277 323 262 326 252 320 M280 307 C283 323 298 326 308 320"
          fill="none"
          stroke="#754A29"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      <g stroke="#9A632E" strokeWidth="3" strokeLinecap="round" opacity=".72">
        <path d="M182 300 L118 288" />
        <path d="M184 316 L114 318" />
        <path d="M191 331 L129 353" />
        <path d="M378 300 L442 288" />
        <path d="M376 316 L446 318" />
        <path d="M369 331 L431 353" />
      </g>

      <g id="heartLayer" pointerEvents="none">
        {hearts.map((heart) => (
          <g key={heart.id} className="heart" transform={`translate(${heart.x} ${heart.y})`}>
            <path d="M0 10 C-24-5 -36 18 0 42 C36 18 24-5 0 10Z" fill="#e8a5ad" opacity=".95" />
          </g>
        ))}
      </g>

      {/* 만지는 자리들. 그림보다 넉넉해야 손가락으로 짚을 수 있어요. */}
      <ellipse
        id="headHit"
        cx="280"
        cy="215"
        rx="155"
        ry="126"
        fill="transparent"
        onPointerDown={(event) => startDrag("head", event)}
      />
      <ellipse
        id="bellyHit"
        cx="280"
        cy="454"
        rx="95"
        ry="78"
        fill="transparent"
        onPointerDown={(event) => startDrag("belly", event)}
      />
      <ellipse
        id="noseHit"
        cx="280"
        cy="290"
        rx="34"
        ry="30"
        fill="transparent"
        onPointerDown={pressNose}
        onPointerUp={releaseNose}
        onPointerCancel={releaseNose}
        onPointerLeave={(event) => {
          if (event.buttons === 0) releaseNose();
        }}
      />
      <ellipse
        id="pawLHit"
        cx="204"
        cy="522"
        rx="48"
        ry="30"
        fill="transparent"
        onPointerDown={(event) => pressPaw("left", event)}
        onPointerUp={() => setPressedPaw(null)}
        onPointerCancel={() => setPressedPaw(null)}
      />
      <ellipse
        id="pawRHit"
        cx="356"
        cy="522"
        rx="48"
        ry="30"
        fill="transparent"
        onPointerDown={(event) => pressPaw("right", event)}
        onPointerUp={() => setPressedPaw(null)}
        onPointerCancel={() => setPressedPaw(null)}
      />
    </svg>
  );
}
