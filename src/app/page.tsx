import { Button } from "~/components/ui/button";
import { signIn } from "./spotify/actions";
import { cookies } from "next/headers";
import { SpotifyApi } from "./spotify/api";
import { redirect } from "next/navigation";

export default async function Home() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const profile = await spotifyApi.getProfile();

  if (profile) return redirect("/spotify");

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <form action={signIn}>
        <Button
          variant="secondary"
          className="rounded-full bg-[#1db954] pl-14 relative"
          type="submit"
        >
          <img
            src="/spotify-xxl.png"
            className="absolute w-7 h-7 top-[6px] left-4"
          />
          Connect your spotify account
        </Button>
      </form>
    </div>
  );
}
