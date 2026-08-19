import type { ReactNode } from "react";
import "./TabBar.css";

export type TabId = "home" | "dex" | "settings";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: "home",
    label: "뚱냥이",
    icon: (
      <>
        <path d="M5.6 10.5 4.4 5.6l4.6 2.6M18.4 10.5l1.2-4.9-4.6 2.6" strokeWidth="1.7" strokeLinejoin="round" />
        <ellipse cx="12" cy="14" rx="7.4" ry="6.2" strokeWidth="1.8" />
        <path d="M9.4 13.4h1.4M13.2 13.4h1.4" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "dex",
    label: "도감",
    icon: (
      <>
        <path d="M5 5.2h11.4a2.4 2.4 0 0 1 2.4 2.4v11.2H7.4A2.4 2.4 0 0 1 5 16.4z" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 16.4a2.4 2.4 0 0 1 2.4-2.4h11.4" strokeWidth="1.8" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "settings",
    label: "설정",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" strokeWidth="1.9" />
        <path
          d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tabbar" aria-label="주요 화면">
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            className={selected ? "tabbar-item is-active" : "tabbar-item"}
            aria-current={selected ? "page" : undefined}
            onClick={() => onChange(tab.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              {tab.icon}
            </svg>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
