"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export function HomeMenu() {
  const pathname = usePathname();

  const isRecentlyPlayedTracks = pathname === "/spotify/home";
  const isSavedTracks = pathname.includes("liked-songs");
  const isTopTracks = pathname.includes("top-songs");

  return (
    <div className="flex items-center mb-8">
      <Link href="/spotify/home">
        <Button
          variant={isRecentlyPlayedTracks ? "secondary" : "ghost"}
          className="rounded-full"
        >
          Recently played songs
        </Button>
      </Link>
      <Link href="/spotify/home/liked-songs">
        <Button
          variant={isSavedTracks ? "secondary" : "ghost"}
          className="rounded-full"
        >
          Liked songs
        </Button>
      </Link>
      <Link href="/spotify/home/top-songs">
        <Button
          variant={isTopTracks ? "secondary" : "ghost"}
          className="rounded-full"
        >
          Top songs
        </Button>
      </Link>
      <Link href="/spotify/home/recommend-songs">
        <Button
          variant={isTopTracks ? "secondary" : "ghost"}
          className="rounded-full"
        >
          Recommend songs
        </Button>
      </Link>
    </div>
  );
}
