import { cookies } from "next/headers";
import { SpotifyApi } from "./api";

import { PlaylistList } from "./components/playlist-list";
import { ScrollArea } from "~/components/ui/scroll-area";
import { AlbumsList } from "./components/albums-list";
import { TrackItem } from "./components/track-item";

export default async function Home() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const [
    recentlyPlayedTracks,
    savedTracks,
    playlists,
    featurePlaylists,
    savedAlbums,
  ] = await Promise.all([
    spotifyApi.getRecentlyPlayedTracks({ limit: 25 }),
    spotifyApi.getSavedTracks({ limit: 25 }),
    spotifyApi.getProfilePlaylists({ limit: 7 }),
    spotifyApi.getProfileFeaturePlaylists({ limit: 7 }),
    spotifyApi.getProfileSavedAlbums({ limit: 7 }),
  ]);

  return (
    <>
      <section className="px-12 mb-8 grid grid-cols-2 gap-2">
        <section>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Your liked songs
          </h2>

          <ScrollArea className="h-80 w-full">
            {savedTracks.map(({ track, added_at }, index) => (
              <TrackItem
                id={track.id}
                key={index}
                index={index}
                name={track.name}
                imageUrl={track.album?.images[0].url}
                artists={track.artists}
                duration={track.duration_ms}
                addedAt={added_at}
              />
            ))}
          </ScrollArea>
        </section>
        <section>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Your recently played songs
          </h2>
          <ScrollArea className="h-80 w-full">
            {recentlyPlayedTracks.map(({ track, played_at }, index) => (
              <TrackItem
                id={track.id}
                key={index}
                index={index}
                name={track.name}
                imageUrl={track.album?.images[0].url}
                artists={track.artists}
                duration={track.duration_ms}
                playedAt={played_at}
              />
            ))}
          </ScrollArea>
        </section>
      </section>
      <PlaylistList title="Your playlists" playlists={playlists} />
      <PlaylistList title="Top playlists" playlists={featurePlaylists} />
      <AlbumsList title="Your saved albums" albums={savedAlbums} />
    </>
  );
}
