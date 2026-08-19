/**
 * 방문 기록 저장.
 *
 * 앱을 켤 때 **딱 한 번** 방문을 기록해요. 탭을 옮기거나 화면을 다시 그린다고
 * 횟수가 올라가면 "오늘 12번 왔다"가 거짓말이 돼요. StrictMode가 개발 중 effect를
 * 두 번 실행하니까 ref로 한 번만 돌게 막아요.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { VisitCtx } from "../hooks/useVisit";
import { pickTreatLine, type Line } from "../lib/lines";
import { EMPTY_STATE, registerVisit, type VisitState } from "../lib/visits";
import { STORAGE_KEYS, loadJson, saveJson } from "../lib/storage";

export function VisitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisitState>(EMPTY_STATE);
  const [line, setLine] = useState<Line | null>(null);
  const [isNewLine, setIsNewLine] = useState(false);
  const [loading, setLoading] = useState(true);

  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;

    // 취소 플래그를 두지 않아요. StrictMode는 effect를 두 번 실행하는데, 첫 실행을
    // cleanup에서 취소해 버리면 두 번째 실행은 위 가드에 막혀서 아무도 상태를
    // 채우지 않고 로딩 화면에 갇혀요. 이 Provider는 앱 루트라 언마운트되지 않아서
    // 늦게 도착한 결과를 반영해도 문제가 없어요.
    void (async () => {
      const saved = await loadJson<VisitState>(STORAGE_KEYS.visit, EMPTY_STATE);
      const result = registerVisit(saved);

      setState(result.state);
      setLine(result.line);
      setIsNewLine(result.isNewLine);
      setLoading(false);

      void saveJson(STORAGE_KEYS.visit, result.state);
    })();
  }, []);

  const giveTreat = useCallback(() => {
    // 아직 안 들은 말을 우선으로 골라요. 최신 목록을 써야 해서 setState 안에서 정해요.
    setState((prev) => {
      const treat = pickTreatLine(prev.seenLineIds);
      setLine(treat);

      if (prev.seenLineIds.includes(treat.id)) {
        setIsNewLine(false);
        return prev;
      }

      const next = { ...prev, seenLineIds: [...prev.seenLineIds, treat.id] };
      setIsNewLine(true);
      void saveJson(STORAGE_KEYS.visit, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY_STATE);
    setLine(null);
    setIsNewLine(false);
    void saveJson(STORAGE_KEYS.visit, EMPTY_STATE);
  }, []);

  const value = useMemo(
    () => ({ state, loading, line, isNewLine, reset, giveTreat }),
    [state, loading, line, isNewLine, reset, giveTreat],
  );

  return <VisitCtx.Provider value={value}>{children}</VisitCtx.Provider>;
}
