import { cookies } from "next/headers";
import { SpotifyApi } from "./api";

import { PlaylistList } from "./components/playlist-list";
import { AlbumsList } from "./components/albums-list";
import { Button } from "~/components/ui/button";
import { TrackListRecommend } from "./components/track-list-recommend";
import { SectionTitle } from "./components/section-title";
import { TrackList } from "./components/track-list";
import Link from "next/link";
import { Track } from "./types";
import { Suspense } from "react";
import { TrackListSkeleton } from "./components/track-list-skeleton";
import { ScrollArea } from "~/components/ui/scroll-area";

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

  const tab = searchParams.tab;
  let tracks: Track[] = [];

  if (searchParams.tab === "recently_played_tracks" || !searchParams.tab) {
    tracks = await spotifyApi.getRecentlyPlayedTracks({ limit: 25 });
  }
  if (searchParams.tab === "saved_tracks") {
    tracks = await spotifyApi.getSavedTracks({ limit: 25 });
  }
  if (searchParams.tab === "top_tracks") {
    tracks = await spotifyApi.getProfileTopTracks({
      limit: 25,
      timeRange: "long_term",
    });
  }

  function getSongsTitle(tab: Props["searchParams"]["tab"]) {
    if (tab === "recently_played_tracks") {
      return "Your recently played songs";
    }
    if (tab === "saved_tracks") {
      return "Your liked songs";
    }
    if (tab === "top_tracks") {
      return "Your top songs";
    }

    return "Songs";
  }

  return (
    <div className="px-12">
      <div className="flex items-center mb-8">
        <Link href="?tab=recently_played_tracks">
          <Button
            variant={
              tab === "recently_played_tracks" || !tab ? "secondary" : "ghost"
            }
            className="rounded-full"
          >
            Recently played songs
          </Button>
        </Link>
        <Link href="?tab=saved_tracks">
          <Button
            variant={tab === "saved_tracks" ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Liked songs
          </Button>
        </Link>
        <Link href="?tab=top_tracks">
          <Button
            variant={tab === "top_tracks" ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Top songs
          </Button>
        </Link>
      </div>

      {tracks.length > 0 && (
        <>
          <SectionTitle title={getSongsTitle(tab)} />
          <section className="mb-8 grid grid-cols-2 gap-2">
            <ScrollArea className="h-96 w-full">
              <TrackList tracks={tracks} />
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
