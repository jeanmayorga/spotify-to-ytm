import { cookies } from "next/headers";
import { SpotifyApi } from "../../api";
import { TrackItem } from "../../components/track-item";
import { Play, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { play } from "../../actions";
import { TrackList } from "../../components/track-list";

interface Props {
  params: { playlistId: string };
}
export default async function Playlist({ params }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const playlist = await spotifyApi.getPlaylist({ id: params.playlistId });

  async function onPlay() {
    "use server";

    play({ context_uri: `spotify:playlist:${params.playlistId}` });
  }

  return (
    <>
      <div className="relative bg-slate-900">
        <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
          <img src={playlist?.images[0].url} className="w-full" />
        </div>
        <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
        <div className="py-8 px-12 flex items-center space-x-4 z-20 relative">
          <img
            src={playlist?.images[0].url}
            className="shadow-2xl w-[204px] h-[204px] drop-shadow-md rounded aspect-square"
          />
          <div className="flex flex-col justify-end ">
            <span className="text-white font-light text-sm mb-2">Playlist</span>
            <h1 className="font-bold text-6xl text-white mb-4 drop-shadow-md">
              {playlist?.name}
            </h1>
            <span className="text-white font-light text-sm mb-2">
              {playlist?.description}
            </span>
            <div className="font-bold text-xs flex items-center mb-2">
              <div className="w-4 h-4 bg-slate-200 rounded-full mr-1"></div>
              {playlist?.owner?.display_name}
            </div>
            <div className="font-light text-xs flex items-center">
              {(playlist?.followers?.total || 0)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}{" "}
              saves
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-20 px-12 py-8 bg-black">
        {/* <div className="mb-8 flex items-center space-x-2">
          <form action={onPlay}>
            <Button className="rounded-full" variant="secondary">
              <Play className="mr-1" /> Play playlist
            </Button>
          </form>
          <form action={onPlay}>
            <Button className="rounded-full" variant="secondary">
              <Sparkles className="mr-1" /> Get recommended songs
            </Button>
          </form>
        </div> */}

        <TrackList
          tracks={playlist?.tracks.items.map((items) => items.track) || []}
        />
      </div>
    </>
  );
}
