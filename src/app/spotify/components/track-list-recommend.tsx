"use client";

import { TrackItem } from "./track-item";
import { Track } from "../types";
import { Button } from "~/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { TrackListSkeleton } from "./track-list-skeleton";
import { useState } from "react";
import { getRecommendedTracks } from "../actions";

interface Props {
  uris: string[];
}
export function TrackListRecommend({ uris }: Props) {
  const [recommendedSongs, setRecommendedSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onGetRecommendedSongs() {
    setIsLoading(true);
    const tracks = await getRecommendedTracks({
      seed_tracks: uris,
    });

    setRecommendedSongs(tracks);
    setIsLoading(false);
  }

  if (recommendedSongs.length === 0) {
    return (
      <>
        <TrackListSkeleton limit={15} animate={isLoading} />

        {!isLoading && (
          <>
            <div className="absolute top-0 left-0 bg-black/80 w-full h-full z-10" />
            <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full z-20">
              <Button
                className="rounded-full"
                variant="secondary"
                onClick={() => onGetRecommendedSongs()}
              >
                <SparklesIcon className="mr-2" />
                Get similar songs
              </Button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {recommendedSongs.map((track, index) => (
        <TrackItem
          id={track.id}
          key={index}
          index={index}
          name={track.name}
          imageUrl={track.album?.images[2].url}
          artists={track.artists}
          duration={track.duration_ms}
          isRecommended
        />
      ))}
    </>
  );
}
