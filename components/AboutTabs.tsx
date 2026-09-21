'use client';

import { useState } from 'react';

type AboutTab = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export function AboutTabs({ tabs }: { tabs: AboutTab[] }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);

  if (tabs.length === 0) return null;

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <section className="mt-12">
      <div
        role="tablist"
        aria-label="About sections"
        className="border-guild-green/20 flex flex-wrap gap-2 border-b pb-3"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`about-panel-${tab.key}`}
              id={`about-tab-${tab.key}`}
              onClick={() => setActiveKey(tab.key)}
              className={`font-display rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase transition-colors ${
                isActive
                  ? 'bg-guild-green text-background'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`about-panel-${activeTab.key}`}
        aria-labelledby={`about-tab-${activeTab.key}`}
        className="mt-6"
      >
        {activeTab.content}
      </div>
    </section>
  );
}