import { ScrollArea } from "~/components/ui/scroll-area";
import { Track } from "../types";
import { TrackItem } from "./track-item";

interface Props {
  tracks: Track[];
}
export function TrackList({ tracks }: Props) {
  return (
    <>
      {tracks.map((track, index) => (
        <TrackItem
          id={track.id}
          key={index}
          index={index}
          name={track.name}
          imageUrl={track.album?.images[2].url}
          artists={track.artists}
          duration={track.duration_ms}
          albumId={track.album?.id}
          albumName={track.album?.name}
          playedAt={track.played_at}
          addedAt={track.added_at}
        />
      ))}
    </>
  );
}
