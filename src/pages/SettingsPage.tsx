/**
 * 설정 화면.
 *
 * 광고를 붙이지 않아요. 결제 흐름과 광고가 같은 화면에 있으면 안 되고,
 * 애초에 스크롤할 콘텐츠도 없어요.
 */

import { useState } from "react";
import { ADFREE_PRICE_LABEL, IAP_READY, useAdFree } from "../hooks/useAdFree";
import { useVisit } from "../hooks/useVisit";
import { TOTAL_LINE_COUNT } from "../lib/lines";
import "./SettingsPage.css";

export function SettingsPage() {
  const { adFree, purchasing, purchase, restore } = useAdFree();
  const { state, reset } = useVisit();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="page">
      <h1 className="page-title">설정</h1>

      {IAP_READY && (
        <div className="card">
          <div className="card-label">광고 제거</div>
          {adFree ? (
            <p className="muted">광고 제거를 이용 중이에요. 뚱냥이가 조용히 고마워해요.</p>
          ) : (
            <>
              <p className="muted">한 번 결제하면 앱 안의 배너 광고가 사라져요.</p>
              <button
                type="button"
                className="btn btn-primary settings-cta"
                disabled={purchasing}
                onClick={purchase}
              >
                {/* 누르기 전에 얼마인지 알 수 있어야 해요. 표시 금액은 부가세를 포함한 결제가예요. */}
                {purchasing ? "결제 중..." : `광고 제거하기 · ${ADFREE_PRICE_LABEL}`}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => void restore()}>
                구매 복원
              </button>
            </>
          )}
        </div>
      )}

      <div className="card">
        <div className="card-label">내 기록</div>
        <p className="muted">
          지금까지 {state.totalCount.toLocaleString("ko-KR")}번 열었고, 말은{" "}
          {state.seenLineIds.length}개 / {TOTAL_LINE_COUNT}개 모았어요.
        </p>

        {confirmingReset ? (
          <>
            <p className="muted">정말 지울까요? 모은 말도 같이 사라져요.</p>
            <div className="settings-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmingReset(false)}
              >
                그대로 두기
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  reset();
                  setConfirmingReset(false);
                }}
              >
                지우기
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setConfirmingReset(true)}
          >
            기록 지우기
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-label">개인정보 처리</div>
        <p className="muted">
          몇 번 열었는지와 어떤 말을 들었는지만 기기 안에 저장해요. 서버로 보내지 않고,
          로그인도 받지 않아요. 기록 지우기를 누르면 즉시 삭제돼요.
        </p>
      </div>

      <div className="card">
        <div className="card-label">이 앱에 대해</div>
        <p className="muted">
          아무 기능도 없어요. 열면 뚱냥이가 한마디 하고, 자주 열수록 시큰둥해져요.
          그게 전부예요.
        </p>
      </div>
    </div>
  );
}
