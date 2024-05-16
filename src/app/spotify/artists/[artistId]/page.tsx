import { cookies } from "next/headers";
import { SpotifyApi } from "../../api";
import { ScrollArea } from "~/components/ui/scroll-area";
import { AlbumsList } from "../../components/albums-list";
import { TrackItem } from "../../components/track-item";
import { SectionTitle } from "../../components/section-title";
import { ArtistItem } from "../../components/artist-item";
import { PlaylistItem } from "../../components/playlist-item";

interface Props {
  params: { artistId: string };
}
export default async function Artist({ params }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const artist = await spotifyApi.getArtist({ id: params.artistId });
  const topTracks = await spotifyApi.getArtistTopTracks({
    id: params.artistId,
  });
  const albums = await spotifyApi.getArtistAlbums({
    id: params.artistId,
    limit: 20,
  });
  const relatedArtists = await spotifyApi.getArtistRelatedArtists({
    id: params.artistId,
  });

  const search = await spotifyApi.search({
    q: `${artist?.name}`,
    limit: 14,
    type: ["playlist"],
  });

  return (
    <>
      <div className="relative bg-slate-900">
        <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
          <img src={artist?.images?.[0]?.url} className="w-full" />
        </div>
        <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
        <div className="py-8 px-12 flex items-center space-x-4 z-20 relative">
          <img
            src={artist?.images?.[0]?.url}
            className="shadow-2xl w-[204px] h-[204px] drop-shadow-md rounded aspect-square"
          />
          <div className="flex flex-col justify-end ">
            <span className="text-white font-light text-sm mb-2">Artist</span>
            <h1 className="font-bold text-7xl text-white mb-4 drop-shadow-md">
              {artist?.name}
            </h1>

            <p className="text-white font-light text-sm">
              <span className="font-bold">Popularity:</span>{" "}
              {artist?.popularity}
            </p>
            <p className="text-white font-light text-sm">
              <span className="font-bold">Followers:</span>{" "}
              {(artist?.followers?.total || 0)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
            </p>
            <p className="text-white font-light text-sm">
              <span className="font-bold">Genres:</span>{" "}
              {artist?.genres.join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-12 py-8 bg-black">
        <section className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-8">
          <section className=" col-span-3">
            <SectionTitle title="Featured Songs" />
            <ScrollArea className="md:h-80 w-full">
              {topTracks.map((track, index) => (
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
                  uris={topTracks.map((t) => t.id)}
                />
              ))}
            </ScrollArea>
          </section>
          <section>
            <SectionTitle title="Similar Artists" />
            <ScrollArea className="md:h-80 w-full">
              {relatedArtists.map((relatedArtist) => (
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

        <section className="mb-8">
          <SectionTitle title="Playlists" />
          <section className="grid md:grid-cols-7 grid-cols-2">
            {search.playlists.items?.map((playlist) => (
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

        <AlbumsList title="Discography" albums={albums} />
      </div>
    </>
  );
}
