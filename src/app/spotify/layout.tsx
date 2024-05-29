import { cookies } from "next/headers";
import { SpotifyApi } from "./api";
import { redirect } from "next/navigation";
import { Header } from "./components/header";
import { Player } from "./components/player";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const profile = await spotifyApi.getProfile();

  if (!profile) return redirect("/");

  return (
    <main className="grid grid-cols-12 px-0">
      <div className="xl:col-span-9 col-span-12 relative overflow-hidden overflow-y-visible transition-all rounded-lg">
        <Header profile={profile} />
        {children}
      </div>
      <div className="xl:col-span-3 xl:block hidden">
        <Player token={spotifyAcessTokenCookie?.value} />
      </div>
    </main>
  );
}
