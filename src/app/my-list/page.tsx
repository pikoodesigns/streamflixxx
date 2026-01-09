import dynamic from 'next/dynamic';

const MyListClient = dynamic(() => import('./MyListClient'), { ssr: false });

export default function MyListPage() {
  return <MyListClient />;
}
