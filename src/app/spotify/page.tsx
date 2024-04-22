import { cookies } from "next/headers";
import { SpotifyApi } from "./api";

import { PlaylistList } from "./components/playlist-list";
import { TrackMiniItem } from "./components/track-mini-item";
import { ScrollArea } from "~/components/ui/scroll-area";

export default async function Home() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const [recentlyPlayedTracks, savedTracks, playlists, featurePlaylists] =
    await Promise.all([
      spotifyApi.getRecentlyPlayedTracks({ limit: 25 }),
      spotifyApi.getSavedTracks({ limit: 25 }),
      spotifyApi.getProfilePlaylists({ limit: 14 }),
      spotifyApi.getProfileFeaturePlaylists({ limit: 14 }),
    ]);

  return (
    <>
      <section className="grid grid-cols-2">
        <section className="px-4 mb-8">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Your liked songs
          </h2>

          <ScrollArea className="h-80 w-full">
            {savedTracks.map((item, index) => (
              <TrackMiniItem
                track={item.track}
                addedAt={item.added_at}
                key={index}
              />
            ))}
          </ScrollArea>
        </section>
        <section className="px-4 mb-8">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Your recently played songs
          </h2>
          <ScrollArea className="h-80 w-full">
            {recentlyPlayedTracks.map((item, index) => (
              <TrackMiniItem
                track={item.track}
                playedAt={item.played_at}
                key={index}
              />
            ))}
          </ScrollArea>
        </section>
      </section>

      <PlaylistList title="Your playlists" playlists={playlists} />
      <PlaylistList title="Top playlists" playlists={featurePlaylists} />
    </>
  );
}
