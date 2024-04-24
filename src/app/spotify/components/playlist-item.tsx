import Link from "next/link";

interface Props {
  id?: string;
  imageUrl?: string;
  name?: string;
  displayName: string;
}
export function PlaylistItem({ id, imageUrl, name, displayName }: Props) {
  return (
    <Link
      href={`/spotify/playlists/${id}`}
      key={id}
      className="hover:bg-[#282828] rounded p-3 transition-all cursor-pointer"
    >
      <img
        src={imageUrl}
        className="rounded mb-4 w-full aspect-square"
        alt="cover"
      />
      <h3 className="font-medium text-base text-white overflow-hidden truncate w-36">
        {name}
      </h3>
      <p className="font-light text-sm text-[#a7a7a7]">{displayName}</p>
    </Link>
  );
}
