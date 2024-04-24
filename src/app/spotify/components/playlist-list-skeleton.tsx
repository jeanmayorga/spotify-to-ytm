interface Props {
  limit?: number;
}
export function PlaylistListSkeleton({ limit }: Props) {
  return (
    <>
      {Array.from(Array(limit || 25).keys()).map((item) => (
        <PlaylistListSkeleton key={item} />
      ))}
    </>
  );
}
