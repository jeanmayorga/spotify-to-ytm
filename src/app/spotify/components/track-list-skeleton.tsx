import { TrackItemSkeleton } from "./track-item-skeleton";

interface Props {
  limit?: number;
}
export function TrackListSkeleton({ limit }: Props) {
  return (
    <>
      {Array.from(Array(limit || 25).keys()).map((item) => (
        <TrackItemSkeleton key={item} />
      ))}
    </>
  );
}
