import { Skeleton } from "~/components/ui/skeleton";
import { getRandomInt } from "../utils";

export function PlaylistSkeleton() {
  return (
    <div className="rounded p-3 transition-all">
      <Skeleton className="rounded mb-[20px] w-full aspect-square" />
      <Skeleton
        style={{ width: `${getRandomInt(40, 100)}px` }}
        className={`h-[14px] rounded bg-gray-400 mb-3`}
      />

      <Skeleton
        style={{ width: `${getRandomInt(40, 100)}px` }}
        className={`h-[12px] rounded bg-gray-600`}
      />
    </div>
  );
}
