'use client';

import dynamic from 'next/dynamic';

const ForestClient = dynamic(
  () => import('./ForestClient'),
  { ssr: false }
);

export default function ForestWrapper() {
  return (
    <div style={{ height: '100vh' }}>
      <ForestClient />
    </div>
  );
}
