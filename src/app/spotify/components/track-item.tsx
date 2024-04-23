import { formatDistance } from "date-fns";
import { Artist, Track } from "../types";
import { msConversion } from "../utils";
import { Button } from "~/components/ui/button";
import Link from "next/link";

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
}: TrackItemProps) {
  return (
    <div className="flex items-center justify-between text-white hover:bg-neutral-800 py-1 px-2 rounded transition-all">
      <div className="flex items-center">
        {Number(index) > -1 && (
          <div className="mr-2 w-[20px] text-xs">{Number(index) + 1}</div>
        )}
        {imageUrl && (
          <img src={imageUrl} className="w-10 h-10 rounded mr-2" alt="cover" />
        )}
        <div className="mr-4">
          <p className="text-base overflow-hidden truncate w-52">{name}</p>
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
            className="mr-4 text-xs font-extralight overflow-hidden truncate w-52 hover:underline hover:text-white"
          >
            {albumName}
          </Link>
        )}
      </div>
      <div className="flex items-center">
        {addedAt && (
          <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-52">
            added {formatDistance(addedAt, new Date(), { addSuffix: true })}
          </div>
        )}

        {playedAt && (
          <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-52">
            played {formatDistance(playedAt, new Date(), { addSuffix: true })}
          </div>
        )}

        <div className="text-xs font-extralight mr-4">
          {msConversion(duration)}
        </div>
        <div>
          <Button variant="outline" size="sm" className="rounded-full">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
