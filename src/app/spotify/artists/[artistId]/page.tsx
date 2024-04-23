import { cookies } from "next/headers";
import { SpotifyApi } from "../../api";
import { ScrollArea } from "~/components/ui/scroll-area";
import { TrackMiniItem } from "../../components/track-mini-item";
import { AlbumsList } from "../../components/albums-list";
import Link from "next/link";
import { TrackItem } from "../../components/track-item";

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

  return (
    <>
      <div className="relative bg-slate-900">
        <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
          <img src={artist?.images[0].url} className="w-full" />
        </div>
        <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
        <div className="py-8 px-12 grid grid-cols-6 gap-4 z-20 relative">
          <img
            src={artist?.images[0].url}
            className="shadow-2xl w-[204px] h-[204px] drop-shadow-md rounded"
          />
          <div className="col-span-5 flex flex-col justify-end ">
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
              {artist?.genres.map((genre) => `${genre} `)}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-20 px-12 py-8 bg-black">
        <section className="grid grid-cols-4 gap-4">
          <section className=" col-span-3">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
              Featured Songs
            </h2>

            <ScrollArea className="h-80 w-full">
              {topTracks.map((track, index) => (
                <TrackItem
                  id={track.id}
                  key={index}
                  index={index}
                  name={track.name}
                  imageUrl={track.album?.images[0].url}
                  albumId={track.album?.id}
                  albumName={track.album?.name}
                  artists={track.artists}
                  duration={track.duration_ms}
                />
              ))}
            </ScrollArea>
          </section>
          <section>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
              Similar Artists
            </h2>
            <ScrollArea className="h-80 w-full">
              {relatedArtists.map((relatedArtist) => (
                <Link
                  href={`/spotify/artists/${relatedArtist.id}`}
                  key={relatedArtist.id}
                  className="flex items-center hover:bg-neutral-800 py-1 px-2 rounded transition-all"
                >
                  <img
                    src={relatedArtist?.images?.[0]?.url}
                    className="w-9 h-9 rounded-full mr-2"
                  />
                  <div>
                    {relatedArtist.name}
                    <div className="text-xs font-extralight">
                      {(relatedArtist?.followers?.total || 0)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}{" "}
                      followers
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollArea>
          </section>
        </section>
      </div>

      <AlbumsList title="Discography" albums={albums} />
    </>
  );
}
