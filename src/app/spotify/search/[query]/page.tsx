import { cookies } from "next/headers";
import { SpotifyApi } from "../../api";
import { AlbumsList } from "../../components/albums-list";
import { ArtistItem } from "../../components/artist-item";
import { PlaylistItem } from "../../components/playlist-item";
import { SectionTitle } from "../../components/section-title";
import { TrackItem } from "../../components/track-item";
import { ScrollArea } from "~/components/ui/scroll-area";

interface Props {
  params: { query: string };
}

export default async function Search({ params }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const query = params.query;

  const search = await spotifyApi.search({
    q: query,
    limit: 14,
    type: ["playlist", "track", "album", "artist"],
  });

  if (!query) {
    return <></>;
  }

  return (
    <>
      <section className="mb-8">
        <section className="grid grid-cols-4 gap-4 mb-8">
          <section className=" col-span-3">
            <SectionTitle title="Songs" />
            <ScrollArea className="h-80 w-full">
              {search?.tracks?.items.map((track, index) => (
                <TrackItem
                  id={track.id}
                  key={index}
                  index={index}
                  name={track.name}
                  imageUrl={track.album?.images[2].url}
                  albumId={track.album?.id}
                  albumName={track.album?.name}
                  artists={track.artists}
                  duration={track.duration_ms}
                />
              ))}
            </ScrollArea>
          </section>
          <section>
            <SectionTitle title="Artists" />
            <ScrollArea className="h-80 w-full">
              {search?.artists?.items.map((relatedArtist) => (
                <ArtistItem
                  key={relatedArtist.id}
                  id={relatedArtist.id}
                  name={relatedArtist.name}
                  imageUrl={relatedArtist?.images?.[0]?.url}
                  followers={relatedArtist?.followers?.total}
                />
              ))}
            </ScrollArea>
          </section>
        </section>
      </section>
      <section className="mb-8">
        <SectionTitle title="Albums" />
        <section className="grid grid-cols-7">
          {search?.playlists?.items?.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              id={playlist.id}
              imageUrl={playlist?.images?.[0]?.url}
              name={playlist.name}
              displayName={playlist.owner.display_name}
            />
          ))}
        </section>
      </section>

      <AlbumsList title="Discography" albums={search?.albums?.items} />
    </>
  );
}
