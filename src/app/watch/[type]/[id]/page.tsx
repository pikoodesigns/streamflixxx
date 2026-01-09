import { getDetails, getTrailer } from '@/lib/tmdb';
import WatchClient from './WatchClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export default async function WatchPage({ params }: PageProps) {
  const { type, id } = await params;
  const mediaType = type as 'movie' | 'tv';
  const mediaId = parseInt(id, 10);
  
  if (!['movie', 'tv'].includes(mediaType) || isNaN(mediaId)) {
    notFound();
  }

  try {
    const [details, trailer] = await Promise.all([
      getDetails(mediaType, mediaId),
      getTrailer(mediaType, mediaId),
    ]);

    if (!trailer) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">No video available</h1>
            <p className="text-netflix-light-gray mb-6">
              Sorry, we couldn't find a video for this title.
            </p>
            <a
              href={`/${mediaType}/${mediaId}`}
              className="px-6 py-2 bg-white text-black rounded hover:bg-white/80 transition-colors"
            >
              Go Back
            </a>
          </div>
        </div>
      );
    }

    return <WatchClient details={details} trailer={trailer} mediaType={mediaType} />;
  } catch (error) {
    console.error('Error fetching watch data:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { type, id } = await params;
  const mediaType = type as 'movie' | 'tv';
  const mediaId = parseInt(id, 10);
  
  try {
    const details = await getDetails(mediaType, mediaId);
    const title = details.title || details.name;
    return {
      title: `Watch ${title} - StreamFlix`,
    };
  } catch {
    return {
      title: 'Watch - StreamFlix',
    };
  }
}
