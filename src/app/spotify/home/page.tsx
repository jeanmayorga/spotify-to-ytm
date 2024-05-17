import { cookies } from "next/headers";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SpotifyApi } from "../api";
import { SectionTitle } from "../components/section-title";
import { TrackItem } from "../components/track-item";
import { TrackListRecommend } from "../components/track-list-recommend";
import { Track } from "../types";
import { uniqBy } from "lodash";

export default async function Page() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const tracks: Track[] = await spotifyApi.getRecentlyPlayedTracks({
    limit: 25,
  });
  const removedRepeatedTracks = uniqBy(tracks, (track) => {
    return track.id;
  });

  return (
    <>
      <SectionTitle title="Your recently played songs" />
      <section className="mb-8 md:grid md:grid-cols-2 gap-2">
        <div>
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Songs</div>
          </div>
          <ScrollArea className="md:h-96 w-full md:mb-0 mb-8">
            {removedRepeatedTracks.map((track, index) => (
              <TrackItem
                id={track.id}
                key={index}
                index={index}
                name={track.name}
                imageUrl={track.album?.images?.[2]?.url}
                artists={track.artists}
                duration={track.duration_ms}
                playedAt={track.played_at}
                addedAt={track.added_at}
                uris={tracks.map((t) => t.id)}
                isSeed={[0, 1, 2, 3, 4, 5].includes(index)}
              />
            ))}
          </ScrollArea>
        </div>
        <div>
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Recommended Songs</div>
          </div>
          <ScrollArea className="md:h-96 w-full relative">
            <TrackListRecommend uris={removedRepeatedTracks.map((t) => t.id)} />
          </ScrollArea>
        </div>
      </section>
    </>
  );
}
