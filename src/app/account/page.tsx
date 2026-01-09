import dynamic from 'next/dynamic';

// Dynamically import with no SSR to avoid localStorage issues during build
const AccountClient = dynamic(() => import('./AccountClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

export default function AccountPage() {
  return <AccountClient />;
}
