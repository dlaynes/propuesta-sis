import { useState, useRef, useCallback, type ReactNode, type KeyboardEvent } from 'react';
import { useAnnouncer } from '../hooks/useAnnouncer';

export interface TabItem {
  id: string;
  label: string;
  content: (isActive: boolean) => ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const { announce } = useAnnouncer();

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveId(tabId);
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        announce(`Mostrando pestaña: ${tab.label}`);
      }
    },
    [tabs, announce]
  );

  const focusTabAt = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (tab) {
        const btn = tabRefs.current.get(tab.id);
        btn?.focus();
      }
    },
    [tabs]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = tabs.findIndex((t) => t.id === activeId);
      if (currentIndex === -1) return;

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          handleTabChange(tabs[nextIndex].id);
          focusTabAt(nextIndex);
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          handleTabChange(tabs[prevIndex].id);
          focusTabAt(prevIndex);
          break;
        }
        case 'Home': {
          e.preventDefault();
          handleTabChange(tabs[0].id);
          focusTabAt(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          handleTabChange(tabs[tabs.length - 1].id);
          focusTabAt(tabs.length - 1);
          break;
        }
        default:
          break;
      }
    },
    [activeId, tabs, focusTabAt, handleTabChange]
  );

  return (
    <div className="space-y-4">
      <div
        className="flex border-b border-sis-border"
        role="tablist"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              activeId === tab.id
                ? 'text-sis-navy'
                : 'text-sis-text-light hover:text-sis-navy'
            }`}
          >
            {tab.label}
            {activeId === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sis-navy rounded-t" />
            )}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeId !== tab.id}
          className="min-h-[200px]"
        >
          {tab.content(activeId === tab.id)}
        </div>
      ))}
    </div>
  );
}
