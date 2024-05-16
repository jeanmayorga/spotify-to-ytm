import { cookies } from "next/headers";
import { HomeMenu } from "../components/home-menu";
import { SpotifyApi } from "../api";
import { SectionTitle } from "../components/section-title";
import { PlaylistList } from "../components/playlist-list";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

interface Props {
  children: React.ReactNode;
}
export default async function Layout({ children }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const [playlists, featurePlaylists] = await Promise.all([
    spotifyApi.getProfilePlaylists({ limit: 14 }),
    spotifyApi.getProfileFeaturePlaylists({ limit: 14 }),
    // spotifyApi.getProfileSavedAlbums({ limit: 7 }),
  ]);

  return (
    <div className="px-12">
      <div className="mb-4">
        <Link
          prefetch
          href="/spotify/search"
          className="rounded-full md:w-80 w-full flex h-10 border border-input bg-background pr-3 pl-9 py-[9px] text-sm ring-offset-background text-muted-foreground relative"
        >
          <SearchIcon className="w-4 h-4 absolute top-[10px] left-3" />
          What do you want to play?
        </Link>
      </div>
      <HomeMenu />

      {children}

      <SectionTitle title="Your playlists" />
      <PlaylistList playlists={playlists} />

      <SectionTitle title="Your top playlists" />
      <PlaylistList playlists={featurePlaylists} />

      {/* <AlbumsList title="Your saved albums" albums={savedAlbums} /> */}
    </div>
  );
}
