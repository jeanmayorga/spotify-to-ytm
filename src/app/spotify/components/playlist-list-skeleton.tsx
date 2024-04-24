import { PlaylistListItemSkeleton } from "./playlist-item-skeleton";

interface Props {
  limit?: number;
}
export function PlaylistListSkeleton({ limit }: Props) {
  return (
    <section className="grid grid-cols-7">
      {Array.from(Array(limit || 25).keys()).map((item) => (
        <PlaylistListItemSkeleton key={item} />
      ))}
    </section>
  );
}
