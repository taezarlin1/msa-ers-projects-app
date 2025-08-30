import BuildingWrapper from '../../components/BuildingWrapper';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico'
    },
    
  };
}



export default function BuildingPage() {
  return <BuildingWrapper />;
}