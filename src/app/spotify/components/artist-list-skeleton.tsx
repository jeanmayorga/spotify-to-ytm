import { ArtistItemSkeleton } from "./artist-item-skeleton";

interface Props {
  limit?: number;
}
export function ArtistListSkeleton({ limit }: Props) {
  return (
    <>
      {Array.from(Array(limit || 25).keys()).map((item) => (
        <ArtistItemSkeleton key={item} />
      ))}
    </>
  );
}
