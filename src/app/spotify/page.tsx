import { cookies } from "next/headers";
import { SpotifyApi } from "./api";

import { PlaylistList } from "./components/playlist-list";
import { AlbumsList } from "./components/albums-list";
import { Button } from "~/components/ui/button";
import { TrackListRecommend } from "./components/track-list-recommend";
import { SectionTitle } from "./components/section-title";
import Link from "next/link";
import { Track } from "./types";
import { ScrollArea } from "~/components/ui/scroll-area";
import { TrackItem } from "./components/track-item";

interface Props {
  searchParams: {
    tab?: "recently_played_tracks" | "saved_tracks" | "top_tracks";
  };
}
export default async function Home({ searchParams }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const [playlists, featurePlaylists, savedAlbums] = await Promise.all([
    spotifyApi.getProfilePlaylists({ limit: 14 }),
    spotifyApi.getProfileFeaturePlaylists({ limit: 7 }),
    spotifyApi.getProfileSavedAlbums({ limit: 7 }),
  ]);

  const isRecentlyPlayedTracks =
    searchParams.tab === "recently_played_tracks" || !searchParams.tab;
  const isSavedTracks = searchParams.tab === "saved_tracks";
  const isTopTracks = searchParams.tab === "top_tracks";

  let tracks: Track[] = [];
  let title: string = "Songs";

  if (isRecentlyPlayedTracks) {
    tracks = await spotifyApi.getRecentlyPlayedTracks({ limit: 25 });
    title = "Your recently played songs";
  }
  if (isSavedTracks) {
    tracks = await spotifyApi.getSavedTracks({ limit: 25 });
    title = "Your liked songs";
  }
  if (isTopTracks) {
    tracks = await spotifyApi.getProfileTopTracks({
      limit: 25,
      timeRange: "long_term",
    });
    title = "Your top songs";
  }

  return (
    <div className="px-12">
      <div className="flex items-center mb-8">
        <Link href="?tab=recently_played_tracks">
          <Button
            variant={isRecentlyPlayedTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Recently played songs
          </Button>
        </Link>
        <Link href="?tab=saved_tracks">
          <Button
            variant={isSavedTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Liked songs
          </Button>
        </Link>
        <Link href="?tab=top_tracks">
          <Button
            variant={isTopTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Top songs
          </Button>
        </Link>
      </div>

      {tracks.length > 0 && (
        <>
          <SectionTitle title={title} />
          <section className="mb-8 grid grid-cols-2 gap-2">
            <ScrollArea className="h-96 w-full">
              {tracks.map((track, index) => (
                <TrackItem
                  id={track.id}
                  key={index}
                  index={index}
                  name={track.name}
                  imageUrl={track.album?.images[2].url}
                  artists={track.artists}
                  duration={track.duration_ms}
                  playedAt={track.played_at}
                  addedAt={track.added_at}
                />
              ))}
            </ScrollArea>
            <ScrollArea className="h-96 w-full">
              <TrackListRecommend uris={tracks.map((t) => t.id)} />
            </ScrollArea>
          </section>
        </>
      )}

      <SectionTitle title="Your playlists" />
      <PlaylistList playlists={playlists} />

      <SectionTitle title="Your top playlists" />
      <PlaylistList playlists={featurePlaylists} />

      <AlbumsList title="Your saved albums" albums={savedAlbums} />
    </div>
  );
}
