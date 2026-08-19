import { createContext, useContext } from "react";
import type { Line } from "../lib/lines";
import type { VisitState } from "../lib/visits";

export interface VisitContextValue {
  state: VisitState;
  loading: boolean;
  /** 이번에 열면서 받은 대사예요. 앱을 켜는 동안 바뀌지 않아요. */
  line: Line | null;
  /** 그 대사를 이번에 처음 봤는지예요. */
  isNewLine: boolean;
  /** 기록을 전부 지워요. */
  reset: () => void;
  /** 간식을 줘서 얻은 대사를 화면에 띄우고 도감에 담아요. */
  giveTreat: () => void;
  /** 코를 눌렀을 때의 대사를 띄우고 도감에 담아요. */
  pokeNose: () => void;
  /** 쓰다듬었을 때의 대사를 띄우고 도감에 담아요. */
  pet: () => void;
}

export const VisitCtx = createContext<VisitContextValue | null>(null);

export function useVisit(): VisitContextValue {
  const value = useContext(VisitCtx);
  if (value == null) throw new Error("useVisit은 VisitProvider 안에서만 쓸 수 있어요.");
  return value;
}
