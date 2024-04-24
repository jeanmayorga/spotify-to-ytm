import { ScrollArea } from "~/components/ui/scroll-area";
import { TrackItem } from "./track-item";
import { cookies } from "next/headers";
import { SpotifyApi } from "../api";
import { Track } from "../types";
import { Button } from "~/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { TrackListSkeleton } from "./track-list-skeleton";

interface Props {
  uris: string[];
}
export async function TrackListRecommend({ uris }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  // const recommendedSongs = await spotifyApi.getRecommendedTracks({
  //   limit: 25,
  //   seed_tracks: uris,
  // });
  const recommendedSongs: Track[] = [];

  // const [tracks, setTracks] = useState<Track[]>([]);

  if (true) {
    return (
      <ScrollArea className="h-96 w-full relative">
        <TrackListSkeleton limit={15} animate={false} />

        <div className="absolute top-0 left-0 bg-black/80 w-full h-full z-10" />
        <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full z-20">
          <Button className="rounded-full" variant="secondary">
            <SparklesIcon className="mr-2" />
            Get similar songs
          </Button>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-96 w-full">
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
    </ScrollArea>
  );
}
