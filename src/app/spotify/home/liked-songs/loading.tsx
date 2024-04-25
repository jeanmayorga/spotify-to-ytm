import { ScrollArea } from "~/components/ui/scroll-area";
import { SectionTitle } from "../../components/section-title";
import { TrackListSkeleton } from "../../components/track-list-skeleton";

export default function Home() {
  return (
    <>
      <SectionTitle title="Your liked songs" />
      <section className="mb-8 grid grid-cols-2 gap-2">
        <ScrollArea className="h-96 w-full">
          <TrackListSkeleton />
        </ScrollArea>
        <ScrollArea className="h-96 w-full">
          <TrackListSkeleton />
        </ScrollArea>
      </section>
    </>
  );
}
