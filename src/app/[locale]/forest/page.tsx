import ForestWrapper from '../../components/ForestWrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico'
    }
  };
}



export default function ForestPage() {
  return <ForestWrapper />;
}