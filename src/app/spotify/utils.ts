import crypto from "crypto";

export function generateCodeVerifier(length: number) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, length);
}

export async function generateCodeChallenge(codeVerifier: string) {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  return hash
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function msConversion(millis: number): string {
  let sec: number = Math.floor(millis / 1000);
  const hrs: number = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  const min: number = Math.floor(sec / 60);
  sec -= min * 60;

  const paddedSec = sec.toString().padStart(2, "0");
  const paddedMin = min.toString().padStart(2, "0");

  return hrs > 0
    ? `${hrs}:${paddedMin}:${paddedSec}`
    : `${paddedMin}:${paddedSec}`;
}
