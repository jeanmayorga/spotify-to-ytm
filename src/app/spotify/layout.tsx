import { cookies } from "next/headers";
import { SpotifyApi } from "./api";
import { redirect } from "next/navigation";
import { Header } from "./components/header";

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
    <main className="container px-0 bg-black">
      <div className="relative overflow-hidden overflow-y-visible transition-all rounded-lg">
        <Header profile={profile} />
        {children}
      </div>
    </main>
  );
}
