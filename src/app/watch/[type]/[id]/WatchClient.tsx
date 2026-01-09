'use client';

import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/player/VideoPlayer';
import { getTitle } from '@/lib/tmdb';
import type { MovieDetails, Video } from '@/types';

interface WatchClientProps {
  details: MovieDetails;
  trailer: Video;
  mediaType: 'movie' | 'tv';
}

export default function WatchClient({ details, trailer, mediaType }: WatchClientProps) {
  const router = useRouter();
  const title = getTitle(details);

  const handleClose = () => {
    // Use history to go back if available, otherwise navigate to movie page
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${mediaType}/${details.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <VideoPlayer
        videoKey={trailer.key}
        title={title}
        movieDetails={details}
        onClose={handleClose}
      />
    </div>
  );
}
