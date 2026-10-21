import App from '../src/App';

export const metadata = {
  title: 'Cozy Cubs Australia | Custom Bedding & Doona Cover Studio',
  description: 'Design custom 100% Organic Cotton doona covers and bedding sets for kids & adults in Australia. Live instant 3D bed customizer with name embroidery & tracked Australia-wide delivery.',
  alternates: {
    canonical: 'https://cozycubs.au',
  },
  openGraph: {
    title: 'Cozy Cubs Australia | Custom Doona Cover Studio',
    description: 'Design custom 100% Organic Cotton bedding online with live 3D preview and tracked AU delivery.',
    url: 'https://cozycubs.au',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function HomePage() {
  return <App />;
}
