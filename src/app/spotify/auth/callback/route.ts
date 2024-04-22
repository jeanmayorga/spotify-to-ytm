import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { config } from "~/app/config";
import axios from "axios";
import { redirect } from "next/navigation";

interface SpotifyAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");
  const clientId = config.X_SPOTIFY_CLIENT_ID;
  const redirectUri = config.X_SPOTIFY_REDIRECT_URI;
  const verifier = cookies().get("verifier")?.value;

  if (!code || !clientId || !verifier) {
    return Response.json({ error: "There was an error." }, { status: 401 });
  }

  try {
    const response = await axios<SpotifyAccessTokenResponse>({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        client_id: clientId,
        code: code,
        code_verifier: verifier,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      },
    });
    const accessToken = response.data.access_token;

    cookies().set("spotify-access-token", accessToken, {
      secure: true,
    });
  } catch (error: any) {
    console.log({ error });
    return Response.json(error?.response?.data);
  }
  redirect("/spotify");
}
