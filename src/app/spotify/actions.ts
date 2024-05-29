"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SpotifyApi } from "./api";
import { generateCodeChallenge, generateCodeVerifier } from "./utils";
import { config } from "../config";
import axios from "axios";

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
    "user-read-private playlist-read-private playlist-read-collaborative user-read-recently-played user-library-read user-modify-playback-state user-top-read streaming user-read-playback-state user-library-modify"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

export async function refreshToken() {
  console.log("refreshing token");
  const spotifyRefreshTokenCookie = cookies().get("spotify-refresh-token");

  try {
    const request = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "refresh_token",
        refresh_token: spotifyRefreshTokenCookie?.value,
        client_id: config.X_SPOTIFY_CLIENT_ID,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const response = request.data;
    console.log({ access_token_1: response.access_token });

    return response.access_token as string;
  } catch (error: any) {
    console.log(
      "error refreshing token ->",
      error?.response?.data?.error_description
    );
    return null;
  }
}

export async function play(options?: {
  context_uri?: string;
  uris?: string[];
}) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  await spotifyApi.play(options);
}

export async function getPlayerDevices() {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  const devices = await spotifyApi.getPlayerDevices();
  return devices;
}

export async function setPlayerDeviceId(options: { device_ids: string[] }) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  await spotifyApi.setPlayerDevice(options);
}

export async function checkSavedTracks(options: { ids: string[] }) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  return spotifyApi.checkSavedTracks(options);
}

export async function insertSavedTracks(options: { ids: string[] }) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  await spotifyApi.insertSavedTracks(options);
}

export async function removeSavedTracks(options: { ids: string[] }) {
  const spotifyAcessTokenCookie = cookies().get("spotify-access-token");
  const spotifyApi = new SpotifyApi(spotifyAcessTokenCookie?.value);

  await spotifyApi.removeSavedTracks(options);
}
