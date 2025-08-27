import ErsTechnologyClient from '../../components/ErsTechnologyClient';


export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico'
    }
  };
}



export default function RecievedMapPage() {
  return <ErsTechnologyClient />;
}