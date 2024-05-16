import { ScrollArea } from "~/components/ui/scroll-area";
import { SectionTitle } from "../../components/section-title";
import { TrackListSkeleton } from "../../components/track-list-skeleton";

export default function Home() {
  return (
    <>
      <SectionTitle title="Your liked songs" />
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
    </>
  );
}
