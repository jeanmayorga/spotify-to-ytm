import { Skeleton } from "~/components/ui/skeleton";
import { getRandomInt } from "../utils";

export function ArtistItemSkeleton() {
  return (
    <div className="flex items-center py-1 px-2 rounded transition-all">
      <Skeleton className="w-9 h-9 rounded-full mr-2 bg-gray-400 aspect-square" />
      <div>
        <Skeleton
          style={{ width: `${getRandomInt(60, 180)}px` }}
          className={`h-[14px] rounded bg-gray-400 mt-1 mb-[8px]`}
        />
        <Skeleton className="w-[100px] h-[12px] rounded-full bg-gray-500 mb-[2px]" />
      </div>
    </div>
  );
}
