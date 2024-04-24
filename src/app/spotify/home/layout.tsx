import { cookies } from "next/headers";
import { HomeMenu } from "../components/home-menu";
import { SpotifyApi } from "../api";
import { SectionTitle } from "../components/section-title";
import { PlaylistList } from "../components/playlist-list";
import { AlbumsList } from "../components/albums-list";

interface Props {
  children: React.ReactNode;
}
export default async function Layout({ children }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const [playlists, featurePlaylists, savedAlbums] = await Promise.all([
    spotifyApi.getProfilePlaylists({ limit: 14 }),
    spotifyApi.getProfileFeaturePlaylists({ limit: 7 }),
    spotifyApi.getProfileSavedAlbums({ limit: 7 }),
  ]);

  return (
    <div className="px-12">
      <HomeMenu />
      {children}

      <SectionTitle title="Your playlists" />
      <PlaylistList playlists={playlists} />

      <SectionTitle title="Your top playlists" />
      <PlaylistList playlists={featurePlaylists} />

      <AlbumsList title="Your saved albums" albums={savedAlbums} />
    </div>
  );
}
