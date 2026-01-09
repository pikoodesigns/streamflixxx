import { getDetails } from '@/lib/tmdb';
import MovieDetailClient from './MovieDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await getDetails('movie', movieId);
    return <MovieDetailClient movie={movie} mediaType="movie" />;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  try {
    const movie = await getDetails('movie', movieId);
    return {
      title: `${movie.title} - StreamFlix`,
      description: movie.overview,
    };
  } catch {
    return {
      title: 'Movie - StreamFlix',
    };
  }
}
