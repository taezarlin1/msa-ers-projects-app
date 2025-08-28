import AuthorizationClient from '../../components/AuthorizationClient';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    icons: {
      icon: '/mstc.ico'
    },
    
  };
}



export default function AuthorizationPage() {
  return <AuthorizationClient />;
}