import { TrackItem } from "./track-item";
import { cookies } from "next/headers";
import { SpotifyApi } from "../api";

interface Props {
  uris: string[];
}
export async function TrackListRecommend({ uris }: Props) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const recommendedSongs = await spotifyApi.getRecommendedTracks({
    seed_tracks: uris,
  });

  return (
    <>
      {recommendedSongs.map((track, index) => (
        <TrackItem
          id={track.id}
          key={index}
          index={index}
          name={track.name}
          imageUrl={track.album?.images[2].url}
          artists={track.artists}
          duration={track.duration_ms}
          isRecommended
        />
      ))}
    </>
  );
}
