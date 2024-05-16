import { cookies } from "next/headers";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SectionTitle } from "../../components/section-title";
import { TrackItem } from "../../components/track-item";
import { TrackListRecommend } from "../../components/track-list-recommend";
import { SpotifyApi } from "../../api";
import { Track } from "../../types";

export default async function Page() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  let tracks: Track[] = await spotifyApi.getProfileTopTracks({ limit: 25 });

  return (
    <>
      <SectionTitle title="Your top songs" />
      <section className="mb-8 md:grid md:grid-cols-2 gap-2">
        <ScrollArea className="md:h-96 w-full md:mb-0 mb-8">
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Songs</div>
          </div>
          {tracks.map((track, index) => (
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
            />
          ))}
        </ScrollArea>
        <ScrollArea className="md:h-96 w-full">
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Recommended Songs</div>
          </div>
          <TrackListRecommend uris={tracks.map((t) => t.id)} />
        </ScrollArea>
      </section>
    </>
  );
}
