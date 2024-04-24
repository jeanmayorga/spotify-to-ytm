import { TrackItemSkeleton } from "./track-item-skeleton";

interface Props {
  limit?: number;
  animate?: boolean;
}
export function TrackListSkeleton({ limit, animate }: Props) {
  return (
    <>
      {Array.from(Array(limit || 25).keys()).map((item) => (
        <TrackItemSkeleton key={item} animate={animate} />
      ))}
    </>
  );
}
