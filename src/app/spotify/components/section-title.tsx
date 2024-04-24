interface Props {
  title: string;
}
export function SectionTitle({ title }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {/* <div className="text-sm">See all playlists</div> */}
    </div>
  );
}
