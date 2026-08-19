/**
 * 뚱냥이를 만졌을 때의 반응.
 *
 * 앉은 자세와 드러누운 자세가 같은 규칙으로 움직여야 해서 훅으로 뺐어요.
 * 두 그림은 생김새만 다르고 "어디를 어떻게 만지면 무슨 일이 나는지"는 같아요.
 */

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface Heart {
  id: number;
  x: number;
  y: number;
}

/** 같은 곳을 계속 문질러도 대사가 쏟아지지 않게 두는 최소 간격이에요. */
const SPEAK_COOLDOWN_MS = 1300;

export interface CatTouchHandlers {
  onPet?: () => void;
  onPokeNose?: () => void;
  onBellyRub?: () => void;
  onPawPress?: () => void;
}

/** 하트가 튀어오르는 자리는 자세마다 달라요. */
export interface HeartOrigins {
  head: { x: number; y: number };
  belly: { x: number; y: number };
  nose: { x: number; y: number };
  paw: { x: number; y: number };
}

export function useCatTouch(handlers: CatTouchHandlers, origins: HeartOrigins) {
  const [petting, setPetting] = useState(false);
  const [squish, setSquish] = useState<"none" | "soft" | "deep">("none");
  const [bellyRubbing, setBellyRubbing] = useState(false);
  const [purring, setPurring] = useState(false);
  const [pressedPaw, setPressedPaw] = useState<string | null>(null);
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

  function startDrag(target: "head" | "belly", event: ReactPointerEvent) {
    dragging.current = target;
    lastX.current = event.clientX;
    distance.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent) {
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
      if (Math.random() > 0.55) {
        spawnHeart(origins.head.x + (Math.random() * 80 - 40), origins.head.y);
      }
      speak(handlers.onPet);
      return;
    }

    if (delta <= 8) return;
    setBellyRubbing(true);
    purr(800);
    if (bellyTimer.current != null) window.clearTimeout(bellyTimer.current);
    bellyTimer.current = window.setTimeout(() => setBellyRubbing(false), 700);
    if (Math.random() > 0.68) {
      spawnHeart(origins.belly.x + (Math.random() * 100 - 50), origins.belly.y);
    }
    speak(handlers.onBellyRub);
  }

  function endDrag() {
    dragging.current = null;
    distance.current = 0;
  }

  function pressNose(event: ReactPointerEvent) {
    event.stopPropagation();
    setPetting(false);
    setSquish("soft");
    speak(handlers.onPokeNose);

    // 오래 누르고 있으면 더 눌려요.
    if (deepTimer.current != null) window.clearTimeout(deepTimer.current);
    deepTimer.current = window.setTimeout(() => {
      setSquish("deep");
      spawnHeart(origins.nose.x, origins.nose.y);
    }, 420);
  }

  function releaseNose() {
    if (deepTimer.current != null) window.clearTimeout(deepTimer.current);
    setSquish("none");
  }

  function pressPaw(id: string, x: number, event: ReactPointerEvent) {
    event.stopPropagation();
    setPressedPaw(id);
    purr(450);
    spawnHeart(x, origins.paw.y);
    speak(handlers.onPawPress);
  }

  function releasePaw() {
    setPressedPaw(null);
  }

  /** 상태를 클래스 이름으로 바꿔요. */
  function stateClass() {
    return [
      petting ? "is-pet" : "",
      squish === "soft" ? "is-squish" : "",
      squish === "deep" ? "is-squish is-deep" : "",
      bellyRubbing ? "is-belly" : "",
      purring ? "is-purring" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return {
    hearts,
    pressedPaw,
    stateClass,
    startDrag,
    moveDrag,
    endDrag,
    pressNose,
    releaseNose,
    pressPaw,
    releasePaw,
  };
}
