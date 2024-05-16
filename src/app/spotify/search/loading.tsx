import { ScrollArea } from "~/components/ui/scroll-area";
import { ArtistListSkeleton } from "../components/artist-list-skeleton";
import { PlaylistListSkeleton } from "../components/playlist-list-skeleton";
import { SectionTitle } from "../components/section-title";
import { TrackListSkeleton } from "../components/track-list-skeleton";

export default async function Loading() {
  return (
    <>
      <section className="grid grid-cols-4 gap-4 mb-8">
        <section className=" col-span-3">
          <SectionTitle title="Songs" />
          <ScrollArea className="h-80 w-full">
            <TrackListSkeleton />
          </ScrollArea>
        </section>
        <section>
          <SectionTitle title="Artists" />
          <ScrollArea className="h-80 w-full">
            <ArtistListSkeleton />
          </ScrollArea>
        </section>
      </section>
      <section className="mb-8">
        <SectionTitle title="Playlists" />
        <PlaylistListSkeleton limit={14} />
      </section>
    </>
  );
}
