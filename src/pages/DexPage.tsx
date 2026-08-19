/**
 * 도감 화면.
 *
 * 들은 말은 그대로 보여주고, 아직 못 들은 말은 가려요. 대신 **어떻게 하면 나오는지**는
 * 알려줘요 — 힌트가 없으면 그냥 안 채워진 칸일 뿐이고, 힌트가 있으면
 * "새벽에 한번 열어볼까"가 돼요. 그게 이 앱이 내일 또 열리는 이유예요.
 */

import { BannerSlot } from "../components/BannerSlot";
import { useVisit } from "../hooks/useVisit";
import { LINE_GROUPS, TOTAL_LINE_COUNT } from "../lib/lines";
import "./DexPage.css";

export function DexPage() {
  const { state } = useVisit();
  const seen = new Set(state.seenLineIds);
  const collected = state.seenLineIds.length;
  const percent = Math.round((collected / TOTAL_LINE_COUNT) * 100);

  return (
    <div className="page">
      <h1 className="page-title">도감</h1>

      <div className="card dex-summary">
        <div className="dex-count">
          {collected} <span className="dex-total">/ {TOTAL_LINE_COUNT}</span>
        </div>
        <div className="dex-bar" role="img" aria-label={`수집률 ${percent}퍼센트`}>
          <div className="dex-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="muted">
          {collected === 0
            ? "아직 아무 말도 못 들었어요."
            : collected >= TOTAL_LINE_COUNT
              ? "전부 모았어요. 이제 정말 그만 오셔도 돼요."
              : `${percent}% 모았어요.`}
        </p>
      </div>

      {LINE_GROUPS.map((group) => {
        const groupSeen = group.lines.filter((line) => seen.has(line.id)).length;

        return (
          <div key={group.title} className="card">
            <div className="dex-group-head">
              <span className="card-label">{group.title}</span>
              <span className="dex-group-count">
                {groupSeen}/{group.lines.length}
              </span>
            </div>
            <p className="muted dex-hint">{group.hint}</p>

            <ul className="dex-list">
              {group.lines.map((line) => (
                <li key={line.id} className={seen.has(line.id) ? "dex-item" : "dex-item is-locked"}>
                  {seen.has(line.id) ? line.text : "???"}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <BannerSlot />
    </div>
  );
}
