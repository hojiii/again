/**
 * 드러누운 뚱냥이.
 *
 * 하루에 서른 번을 넘기면 이 자세가 돼요. 앉은 자세에서 눈만 감는 것으로는
 * "완전히 포기했다"가 안 읽혀서, 아예 발라당 누운 그림으로 바꿔요.
 *
 * 그림은 사용자가 그린 SVG 그대로예요. 만지는 규칙은 앉은 자세와 같아서
 * `useCatTouch` 를 함께 써요 — 자세가 바뀐다고 조작법까지 달라지면 안 돼요.
 */

import { useCatTouch, type CatTouchHandlers } from "../hooks/useCatTouch";
import "./LyingCat.css";

/** 이 자세에서 하트가 튀어오르는 자리예요. */
const HEART_ORIGINS = {
  head: { x: 427, y: 170 },
  belly: { x: 440, y: 330 },
  nose: { x: 424, y: 200 },
  paw: { y: 470 },
} as const;

export function LyingCat(handlers: CatTouchHandlers) {
  const touch = useCatTouch(handlers, {
    head: HEART_ORIGINS.head,
    belly: HEART_ORIGINS.belly,
    nose: HEART_ORIGINS.nose,
    paw: { x: 0, y: HEART_ORIGINS.paw.y },
  });

  const paw = (id: string, x: number) => ({
    className: touch.pressedPaw === id ? "is-pressed" : undefined,
    onPointerDown: (event: React.PointerEvent) => touch.pressPaw(id, x, event),
    onPointerUp: touch.releasePaw,
    onPointerCancel: touch.releasePaw,
  });

  return (
    <svg
      className={`cat lying ${touch.stateClass()}`}
      viewBox="0 0 900 650"
      role="img"
      aria-label="드러누운 뚱냥이"
      onPointerMove={touch.moveDrag}
      onPointerUp={touch.endDrag}
      onPointerCancel={touch.endDrag}
    >
      {/* 바닥 */}
      <ellipse cx="455" cy="540" rx="330" ry="44" fill="#b6a895" opacity=".17" />

      {/* 엉덩이를 따라 말린 꼬리 */}
      <g id="tail" className="tailIdle">
        <path
          d="M635 416 C742 405 784 445 754 486 C729 520 669 514 658 486 C650 464 682 449 702 466"
          fill="none"
          stroke="#D98A33"
          strokeWidth="46"
          strokeLinecap="round"
        />
        <path d="M703 424 Q726 439 731 459" fill="none" stroke="#C77929" strokeWidth="12" strokeLinecap="round" />
      </g>

      {/* 몸통 — 어깨에서 엉덩이로 이어지는 비대칭 실루엣 */}
      <g id="body" className="breathe">
        <path
          d="M262 330 C295 252 383 223 470 236 C558 249 627 296 651 373 C667 423 653 471 615 497 C574 525 508 534 436 525 C353 516 288 493 257 450 C225 406 231 365 262 330Z"
          fill="#E6A04B"
        />
        <path d="M292 324 C255 301 229 320 232 352 C235 386 264 403 302 392Z" fill="#E6A04B" />
        <path d="M607 352 C646 343 672 367 666 403 C661 435 635 451 601 442Z" fill="#E6A04B" />

        <g fill="none" stroke="#C77929" strokeWidth="15" strokeLinecap="round" opacity=".85">
          <path d="M325 278 Q344 306 340 333" />
          <path d="M372 257 Q390 289 386 319" />
          <path d="M548 277 Q531 307 536 334" />
          <path d="M591 301 Q575 327 580 350" />
        </g>
      </g>

      {/* 배 — 몸이 기울어 있어 살짝 비껴 있어요 */}
      <g id="belly">
        <ellipse cx="440" cy="409" rx="147" ry="102" fill="#FFD48A" transform="rotate(-5 440 409)" />
        <ellipse cx="433" cy="424" rx="106" ry="70" fill="#FFE8B9" opacity=".75" transform="rotate(-5 433 424)" />
        <circle cx="449" cy="452" r="5.5" fill="#D99B5F" opacity=".7" />
      </g>

      {/* 뒷다리 — 왼쪽은 뻗고 오른쪽은 접었어요 */}
      <g id="hindL" {...paw("hindL", 251)}>
        <path
          d="M305 440 C269 463 234 495 225 526 C218 550 239 568 265 560 C297 550 320 515 340 478Z"
          fill="#F0B45F"
        />
        <ellipse cx="251" cy="538" rx="35" ry="27" fill="#FFD9AE" transform="rotate(-22 251 538)" />
        <circle cx="235" cy="530" r="7.5" fill="#DFAAA4" />
        <circle cx="251" cy="523" r="7.5" fill="#DFAAA4" />
        <circle cx="267" cy="530" r="7.5" fill="#DFAAA4" />
        <ellipse cx="251" cy="543" rx="16" ry="12" fill="#DFAAA4" />
      </g>

      <g id="hindR" {...paw("hindR", 632)}>
        <path
          d="M565 457 C599 467 632 491 649 516 C660 533 653 551 634 556 C608 564 576 540 550 500Z"
          fill="#F0B45F"
        />
        <ellipse cx="632" cy="535" rx="33" ry="25" fill="#FFD9AE" transform="rotate(18 632 535)" />
        <circle cx="617" cy="528" r="7" fill="#DFAAA4" />
        <circle cx="632" cy="522" r="7" fill="#DFAAA4" />
        <circle cx="647" cy="529" r="7" fill="#DFAAA4" />
        <ellipse cx="632" cy="540" rx="15" ry="11" fill="#DFAAA4" />
      </g>

      {/* 앞다리 */}
      <g id="foreL" {...paw("foreL", 266)}>
        <path
          d="M332 311 C302 287 279 270 258 280 C240 289 244 316 262 333 C282 352 305 359 329 350Z"
          fill="#F0B45F"
        />
        <ellipse cx="266" cy="297" rx="28" ry="21" fill="#FFD9AE" transform="rotate(-28 266 297)" />
        <circle cx="253" cy="291" r="6.5" fill="#DFAAA4" />
        <circle cx="266" cy="286" r="6.5" fill="#DFAAA4" />
        <circle cx="279" cy="292" r="6.5" fill="#DFAAA4" />
      </g>

      <g id="foreR" {...paw("foreR", 611)}>
        <path
          d="M548 313 C576 290 599 279 618 290 C635 300 631 324 614 339 C595 356 572 360 549 350Z"
          fill="#F0B45F"
        />
        <ellipse cx="611" cy="306" rx="28" ry="21" fill="#FFD9AE" transform="rotate(24 611 306)" />
        <circle cx="598" cy="300" r="6.5" fill="#DFAAA4" />
        <circle cx="611" cy="295" r="6.5" fill="#DFAAA4" />
        <circle cx="624" cy="301" r="6.5" fill="#DFAAA4" />
      </g>

      {/* 머리와 몸을 잇는 목털 */}
      <path
        d="M364 286 C389 264 427 257 459 262 C492 267 515 283 530 307 C494 326 400 330 364 286Z"
        fill="#E6A04B"
      />

      <g id="head">
        <ellipse cx="427" cy="241" rx="118" ry="96" fill="#E6A04B" transform="rotate(-7 427 241)" />
      </g>

      <g id="muzzle">
        <ellipse cx="421" cy="264" rx="86" ry="62" fill="#FFE0A3" transform="rotate(-5 421 264)" />
      </g>

      <g id="ears">
        <path d="M341 227 C314 184 337 160 385 178 C367 188 356 204 354 229Z" fill="#C77929" />
        <path d="M500 212 C530 175 509 151 466 172 C483 181 493 195 493 218Z" fill="#C77929" />
        <path d="M348 207 Q361 187 375 194" fill="none" stroke="#DCA69D" strokeWidth="10" strokeLinecap="round" />
        <path d="M494 194 Q481 177 469 184" fill="none" stroke="#DCA69D" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* 이마 M자 */}
      <g stroke="#C77929" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M389 171 Q403 187 405 207" />
        <path d="M427 165 L427 207" />
        <path d="M465 171 Q451 187 449 207" />
      </g>

      <g id="cheeks">
        <ellipse cx="377" cy="275" rx="45" ry="31" fill="#FFE1A8" />
        <ellipse cx="469" cy="268" rx="45" ry="31" fill="#FFE1A8" />
      </g>

      {/* 반쯤 감긴 눈 */}
      <g id="eyes" className="blink">
        <path d="M360 238 Q381 248 399 237" fill="none" stroke="#5D412B" strokeWidth="8" strokeLinecap="round" />
        <path d="M448 232 Q468 242 486 231" fill="none" stroke="#5D412B" strokeWidth="8" strokeLinecap="round" />
      </g>

      <g id="nose">
        <path d="M407 260 Q424 249 441 260 Q438 276 424 279 Q410 276 407 260Z" fill="#B98383" />
      </g>
      <path
        d="M424 279 C421 292 411 294 402 288 M424 279 C427 292 438 294 446 288"
        fill="none"
        stroke="#754A29"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      <g stroke="#9A632E" strokeWidth="3.2" strokeLinecap="round" opacity=".72">
        <path d="M350 270 L290 257" />
        <path d="M352 284 L287 287" />
        <path d="M493 264 L549 248" />
        <path d="M491 279 L551 281" />
      </g>

      <g id="heartLayer" pointerEvents="none">
        {touch.hearts.map((heart) => (
          <g key={heart.id} className="heart" transform={`translate(${heart.x} ${heart.y})`}>
            <path d="M0 10 C-24-5 -36 18 0 42 C36 18 24-5 0 10Z" fill="#e8a5ad" opacity=".95" />
          </g>
        ))}
      </g>

      {/* 만지는 자리 */}
      <ellipse
        id="headHit"
        cx="427"
        cy="215"
        rx="120"
        ry="80"
        fill="transparent"
        onPointerDown={(event) => touch.startDrag("head", event)}
      />
      <ellipse
        id="bellyHit"
        cx="440"
        cy="408"
        rx="145"
        ry="98"
        fill="transparent"
        onPointerDown={(event) => touch.startDrag("belly", event)}
      />
      <ellipse
        id="noseHit"
        cx="424"
        cy="265"
        rx="33"
        ry="26"
        fill="transparent"
        onPointerDown={touch.pressNose}
        onPointerUp={touch.releaseNose}
        onPointerCancel={touch.releaseNose}
        onPointerLeave={(event) => {
          if (event.buttons === 0) touch.releaseNose();
        }}
      />
    </svg>
  );
}
