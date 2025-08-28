import WaterResourceWrapper from '../../components/WaterResourceWrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico',
    },
  };
}

export default function WaterResourcePage() {
  return <WaterResourceWrapper />;
}
