'use client';

import dynamic from 'next/dynamic';

const WaterResourceClient = dynamic(
  () => import('./WaterResourceClient'),
  { ssr: false }
);

export default function WaterResourceWrapper() {
  return (
    <div style={{ height: '100vh' }}>
      <WaterResourceClient />
    </div>
  );
}
