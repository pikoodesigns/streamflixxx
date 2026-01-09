import { getDetails } from '@/lib/tmdb';
import MovieDetailClient from '../../movie/[id]/MovieDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: PageProps) {
  const { id } = await params;
  const showId = parseInt(id, 10);
  
  if (isNaN(showId)) {
    notFound();
  }

  try {
    const show = await getDetails('tv', showId);
    return <MovieDetailClient movie={show} mediaType="tv" />;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const showId = parseInt(id, 10);
  
  try {
    const show = await getDetails('tv', showId);
    return {
      title: `${show.name} - StreamFlix`,
      description: show.overview,
    };
  } catch {
    return {
      title: 'TV Show - StreamFlix',
    };
  }
}
