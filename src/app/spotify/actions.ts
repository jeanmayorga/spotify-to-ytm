"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SpotifyApi } from "./api";
import { generateCodeChallenge, generateCodeVerifier } from "./utils";
import { config } from "../config";

export async function signOut() {
  cookies().delete("spotify-access-token");
  cookies().delete("verifier");

  redirect(`/`);
}

export async function signIn() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");

  if (spotifyAcessTokenCookie?.value) {
    const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);
    const profile = await spotifyApi.getProfile();

    if (profile?.id) return redirect("/spotify");
  }

  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  cookies().set("verifier", verifier, { secure: true });

  const params = new URLSearchParams();
  params.append("client_id", config.X_SPOTIFY_CLIENT_ID);
  params.append("redirect_uri", config.X_SPOTIFY_REDIRECT_URI);
  params.append("response_type", "code");
  params.append(
    "scope",
    "user-read-private playlist-read-private playlist-read-collaborative user-read-recently-played user-library-read"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}