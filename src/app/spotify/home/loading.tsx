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
      <section className="mb-8 md:grid md:grid-cols-2 gap-2">
        <ScrollArea className="md:h-96 w-full md:mb-0 mb-8">
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Songs</div>
          </div>
          <TrackListSkeleton />
        </ScrollArea>
        <ScrollArea className="h-96 w-full">
          <div className="border-b uppercase text-xs font-bold mb-4 text-gray-500 py-1 flex items-center">
            <div className="px-2">#</div>
            <div className="px-3">Recommended Songs</div>
          </div>
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
