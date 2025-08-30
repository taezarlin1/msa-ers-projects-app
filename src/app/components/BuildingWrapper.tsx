'use client';

import dynamic from 'next/dynamic';

const BuildingClient = dynamic(
  () => import('./BuildingClient'),
  { ssr: false }
);

export default function BuildingWrapper() {
  return (
    <div style={{ height: '100vh' }}>
      <BuildingClient />
    </div>
  );
}
