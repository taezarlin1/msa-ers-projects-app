import OsisClient from '@/app/components/OsisClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico'
    },
    
  };
}



export default function FirePage() {
  return <OsisClient />;
}