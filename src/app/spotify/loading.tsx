import { Button } from "~/components/ui/button";
import { SectionTitle } from "./components/section-title";
import Link from "next/link";
import { ScrollArea } from "~/components/ui/scroll-area";
import { TrackListSkeleton } from "./components/track-list-skeleton";
import { PlaylistListSkeleton } from "./components/playlist-list-skeleton";

interface Props {
  searchParams: {
    tab?: "recently_played_tracks" | "saved_tracks" | "top_tracks";
  };
}
export default function Home({ searchParams }: Props) {
  const isRecentlyPlayedTracks =
    searchParams?.tab === "recently_played_tracks" || !searchParams?.tab;
  const isSavedTracks = searchParams?.tab === "saved_tracks";
  const isTopTracks = searchParams?.tab === "top_tracks";

  let title: string = "Songs";

  if (isRecentlyPlayedTracks) {
    title = "Your recently played songs";
  }
  if (isSavedTracks) {
    title = "Your liked songs";
  }
  if (isTopTracks) {
    title = "Your top songs";
  }

  return (
    <div className="px-12">
      <div className="flex items-center mb-8">
        <Link href="?tab=recently_played_tracks">
          <Button
            variant={isRecentlyPlayedTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Recently played songs
          </Button>
        </Link>
        <Link href="?tab=saved_tracks">
          <Button
            variant={isSavedTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Liked songs
          </Button>
        </Link>
        <Link href="?tab=top_tracks">
          <Button
            variant={isTopTracks ? "secondary" : "ghost"}
            className="rounded-full"
          >
            Top songs
          </Button>
        </Link>
      </div>

      <SectionTitle title={title} />
      <section className="mb-8 grid grid-cols-2 gap-2">
        <ScrollArea className="h-96 w-full">
          <TrackListSkeleton />
        </ScrollArea>
        <ScrollArea className="h-96 w-full">
          <TrackListSkeleton />
        </ScrollArea>
      </section>

      <section className="mb-8">
        <SectionTitle title="Your playlists" />
        <PlaylistListSkeleton limit={14} />
      </section>

      <section className="mb-8">
        <SectionTitle title="Your top playlists" />
        <PlaylistListSkeleton limit={14} />
      </section>
    </div>
  );
}
