// /dictation/layout.tsx

import React from 'react';

export default function LayoutDictation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden">
      {children}
    </main>
  );
}
