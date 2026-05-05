import { useState, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="space-y-4">
      <div className="flex border-b border-sis-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
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
      <div className="min-h-[200px]">{activeTab?.content}</div>
    </div>
  );
}
