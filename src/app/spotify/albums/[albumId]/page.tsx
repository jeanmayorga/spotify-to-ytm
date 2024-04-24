import { cookies } from "next/headers";
import { SpotifyApi } from "../../api";
import { TrackItem } from "../../components/track-item";
import { play } from "../../actions";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";

interface Props {
  params: { albumId: string };
}
export default async function Playlist({ params }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const album = await spotifyApi.getAlbum({ id: params.albumId });
  const tracks = await spotifyApi.getAlbumTracks({
    id: params.albumId,
    limit: album?.total_tracks || 10,
  });

  async function onPlay() {
    "use server";

    play({ context_uri: `spotify:album:${params.albumId}` });
  }

  return (
    <>
      <div className="relative bg-slate-900">
        <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
          <img src={album?.images[2].url} className="w-full" />
        </div>
        <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
        <div className="py-8 px-12 grid grid-cols-6 gap-4 z-20 relative">
          <img
            src={album?.images[0].url}
            className="shadow-2xl w-[204px] h-[204px] drop-shadow-md rounded"
          />
          <div className="col-span-5 flex flex-col justify-end ">
            <span className="text-white font-light text-sm mb-2">Album</span>
            <h1 className="font-bold text-6xl text-white mb-4 drop-shadow-md">
              {album?.name}
            </h1>

            <div className="font-bold text-xs flex items-center mb-2">
              <div className="w-4 h-4 bg-slate-200 rounded-full mr-1"></div>
              {album?.artists?.[0]?.name}
            </div>
            <p className="text-white font-light text-sm">
              <span className="font-bold">Songs:</span> {album?.total_tracks}
            </p>
            <p className="text-white font-light text-sm">
              <span className="font-bold">Popularity:</span> {album?.popularity}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-20 px-12 py-8 bg-black">
        <div className="mb-8">
          <form action={onPlay}>
            <Button className="rounded-full" variant="secondary">
              <Play className="mr-1" /> Play playlist
            </Button>
          </form>
        </div>

        {tracks.map((track, index) => (
          <TrackItem
            id={track.id}
            key={index}
            index={index}
            name={track.name}
            imageUrl={album?.images[2].url}
            albumId={album?.id}
            albumName={album?.name}
            artists={track.artists}
            duration={track.duration_ms}
          />
        ))}
      </div>
    </>
  );
}
