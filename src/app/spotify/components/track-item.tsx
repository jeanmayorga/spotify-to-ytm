import { formatDistance } from "date-fns";
import { Track } from "../types";
import { msConversion } from "../utils";
import { cn } from "~/lib/utils";

interface TrackItemProps {
  track: Track;
  addedAt: string;
  index: number;
}
export function TrackItem({ track, index, addedAt }: TrackItemProps) {
  return (
    <div className="flex items-center justify-between text-white hover:bg-neutral-800 py-1 px-2 rounded cursor-pointer transition-all">
      <div className="flex items-center">
        <div className="mr-2 w-[20px] text-xs">{index + 1}</div>
        <img
          src={track.album.images[2].url}
          className="w-10 h-10 rounded mr-2"
          alt="cover"
        />
        <div className="mr-4">
          <p className="text-base overflow-hidden truncate w-52">
            {track.name}
          </p>
          <div className="text-xs font-extralight overflow-hidden truncate w-52">
            {track.artists.map((artist) => (
              <span className="mr-2" key={artist.id}>
                {artist.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-52">
          {track.album.name}
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-52">
          added {formatDistance(addedAt, new Date(), { addSuffix: true })}
        </div>
        <div className="text-xs font-extralight mx-2">
          {msConversion(track.duration_ms)}
        </div>
      </div>
    </div>
  );
}
