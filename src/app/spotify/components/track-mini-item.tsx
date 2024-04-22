import { formatDistance } from "date-fns";
import { Track } from "../types";
import { msConversion } from "../utils";

interface TrackMiniItemProps {
  track: Track;
  playedAt?: string;
  addedAt?: string;
}
export function TrackMiniItem({
  track,
  playedAt,
  addedAt,
}: TrackMiniItemProps) {
  return (
    <div className="flex items-center justify-between text-white hover:bg-neutral-800 py-1 px-2 rounded cursor-pointer transition-all">
      <div className="flex items-center">
        <img
          src={track.album.images[2].url}
          className="w-9 h-9 rounded mr-2"
          alt="cover"
        />
        <div className="mr-4">
          <p className="text-sm overflow-hidden truncate w-52">{track.name}</p>
          <div className="text-xs font-extralight overflow-hidden truncate w-52">
            {track.artists.map((artist) => (
              <span className="mr-2" key={artist.id}>
                {artist.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 text-xs font-extralight overflow-hidden truncate w-52">
          {playedAt &&
            `played ${formatDistance(playedAt, new Date(), {
              addSuffix: true,
            })}`}
          {addedAt &&
            `added ${formatDistance(addedAt, new Date(), { addSuffix: true })}`}
        </div>
        <div className="text-xs font-extralight mx-2">
          {msConversion(track.duration_ms)}
        </div>
      </div>
    </div>
  );
}
