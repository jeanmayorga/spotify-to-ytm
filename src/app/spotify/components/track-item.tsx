"use client";

import { formatDistance } from "date-fns";
import { Artist } from "../types";
import { msConversion } from "../utils";
import Link from "next/link";
import { play } from "../actions";
import { Play } from "lucide-react";
import { useCurrentTrack } from "../store";
import { cn } from "~/lib/utils";

function getNextUris(uris: string[], id: string) {
  const index = uris.indexOf(id);
  if (index === -1) return [];
  const resultArray = uris.slice(index);
  const prefixedArray = resultArray.map((item) => `spotify:track:${item}`);
  return prefixedArray;
}

interface TrackItemProps {
  index?: number;
  id: string;
  imageUrl?: string;
  name: string;
  albumId?: string;
  albumName?: string;
  artists: Artist[];
  duration: number;
  addedAt?: string;
  playedAt?: string;
  isRecommended?: boolean;
  uris?: string[];
  isSeed?: boolean;
}
export function TrackItem({
  index,
  id,
  imageUrl,
  name,
  albumId,
  albumName,
  artists,
  duration,
  addedAt,
  playedAt,
  isRecommended,
  uris,
  isSeed,
}: TrackItemProps) {
  const { track } = useCurrentTrack();
  const isPlaying = track?.id === id;

  async function onPlay() {
    if (isPlaying) return;
    if (uris && uris.length > 0) {
      await play({
        uris: getNextUris(uris, id),
      });
    } else {
      await play({
        uris: [`spotify:track:${id}`],
      });
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between text-white hover:bg-neutral-800 active:bg-neutral-900 py-1 px-2 rounded transition-all group select-none",
        isSeed && "bg-gray-950 rounded-none"
      )}
      onDoubleClick={onPlay}
    >
      <div className="flex items-center">
        {Number(index) > -1 && (
          <div
            className={cn(
              "mr-2 w-[20px] text-sm",
              isPlaying && "text-[#1cd760]"
            )}
            onClick={onPlay}
          >
            {isPlaying ? (
              <img
                width="14"
                height="14"
                alt=""
                src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
              />
            ) : (
              <>
                <span className="block group-hover:hidden">
                  {Number(index) + 1}
                </span>
                <Play className="w-4 h-4 hidden group-hover:block fill-white" />
              </>
            )}
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            className="w-10 h-10 rounded mr-2"
            alt="cover"
            onClick={onPlay}
          />
        )}
        <div className="mr-4">
          <p
            className={cn(
              "text-base overflow-hidden truncate w-52",
              isPlaying && "text-[#1cd760]"
            )}
          >
            {name}
          </p>
          {artists?.length > 0 && (
            <div className="text-xs font-extralight overflow-hidden truncate w-52">
              {artists.map((artist) => (
                <Link
                  href={`/spotify/artists/${artist.id}`}
                  className="mr-2 hover:underline hover:text-white"
                  key={artist.id}
                >
                  {artist.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {albumName && albumId && (
          <Link
            href={`/spotify/albums/${albumId}`}
            className="mr-4 text-xs font-extralight overflow-hidden truncate w-52 hover:underline hover:text-white  md:block hidden"
          >
            {albumName}
          </Link>
        )}
      </div>
      <div className="flex items-center">
        {addedAt && (
          <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-40  md:block hidden">
            added {formatDistance(addedAt, new Date(), { addSuffix: true })}
          </div>
        )}

        {playedAt && (
          <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-40  md:block hidden">
            played {formatDistance(playedAt, new Date(), { addSuffix: true })}
          </div>
        )}

        {isRecommended && (
          <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-40 md:block hidden">
            Recommended
          </div>
        )}

        <div className="text-xs font-extralight mr-4">
          {msConversion(duration)}
        </div>
        {/* <div>
          <Button variant="outline" size="sm" className="rounded-full">
            Add
          </Button>
        </div> */}
      </div>
    </div>
  );
}
