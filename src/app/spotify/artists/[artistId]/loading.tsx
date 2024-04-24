import { Skeleton } from "~/components/ui/skeleton";
import { TrackListSkeleton } from "../../components/track-list-skeleton";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ArtistListSkeleton } from "../../components/artist-list-skeleton";
import { SectionTitle } from "../../components/section-title";
import { PlaylistListSkeleton } from "../../components/playlist-list-skeleton";

export default async function Loading() {
  return (
    <>
      <div className="relative">
        <div className="absolute w-full h-full scale-150 bottom-0 blur-3xl z-0 bg-gradient-to-b from-slate-800 to-neutral-600" />
        <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
        <div className="py-8 px-12 top-0 left-0 flex items-center space-x-4 z-20 relative">
          <Skeleton className="shadow-2xl bg-gray-400 w-[204px] h-[204px] drop-shadow-md rounded" />

          <div className="flex flex-col justify-end">
            <Skeleton className="shadow-2xl w-[100px] h-[11px] drop-shadow-md rounded mb-5 bg-gray-500" />
            <Skeleton className="shadow-2xl w-[500px] h-[53px] drop-shadow-md rounded mb-[31px] bg-gray-400" />

            <Skeleton className="shadow-2xl w-[70px] h-[11px] drop-shadow-md rounded bg-gray-500 mb-[8px]" />
            <Skeleton className="shadow-2xl w-[120px] h-[11px] drop-shadow-md rounded bg-gray-500 mb-[8px]" />
            <Skeleton className="shadow-2xl w-[220px] h-[11px] drop-shadow-md rounded bg-gray-500" />
          </div>
        </div>
      </div>

      <div className="relative z-20 px-12 py-8 bg-black">
        <section className="grid grid-cols-4 gap-4 mb-8">
          <section className=" col-span-3">
            <SectionTitle title="Featured Songs" />
            <ScrollArea className="h-80 w-full">
              <TrackListSkeleton />
            </ScrollArea>
          </section>
          <section>
            <SectionTitle title="Similar Artists" />
            <ScrollArea className="h-80 w-full">
              <ArtistListSkeleton />
            </ScrollArea>
          </section>
        </section>
        <section className="mb-8">
          <SectionTitle title="Playlists" />
          <PlaylistListSkeleton limit={14} />
        </section>
      </div>
    </>
  );
}
