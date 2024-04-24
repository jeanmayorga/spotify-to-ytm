import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PlaylistListSkeleton } from "../components/playlist-list-skeleton";
import { SectionTitle } from "../components/section-title";
import { TrackListSkeleton } from "../components/track-list-skeleton";

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
    <>
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
    </>
  );
}
