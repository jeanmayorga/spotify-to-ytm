import { Skeleton } from "~/components/ui/skeleton";
import { getRandomInt } from "../utils";

interface Props {
  animate?: boolean;
}
export function TrackItemSkeleton({ animate }: Props) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded transition-all">
      <div className="flex items-center">
        <div className="mr-2 w-[20px]">
          <Skeleton
            className="w-[8px] h-[12px] rounded-full bg-gray-400"
            animate={animate}
          />
        </div>
        <Skeleton
          className="w-10 h-10 rounded mr-2 bg-gray-500"
          animate={animate}
        />
        <div className="mr-4">
          <Skeleton
            style={{ width: `${getRandomInt(100, 180)}px` }}
            className={`h-[18px] rounded bg-gray-400 mb-[6px]`}
            animate={animate}
          />
          <div className="flex space-x-1">
            <Skeleton
              style={{ width: `${getRandomInt(50, 140)}px` }}
              className="h-[12px] rounded-full bg-gray-500"
              animate={animate}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <Skeleton
            className="w-[30px] h-[13px] rounded-full"
            animate={animate}
          />
        </div>
      </div>
    </div>
  );
}
