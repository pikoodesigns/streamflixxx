import dynamic from 'next/dynamic';

const ProfilesClient = dynamic(() => import('./ProfilesClient'), { ssr: false });

export default function ProfilesPage() {
  return <ProfilesClient />;
}
