import Link from "next/link";

interface Props {
  id: string;
  name: string;
  imageUrl: string;
  followers?: number;
}
export function ArtistItem({ id, name, imageUrl, followers }: Props) {
  return (
    <Link
      href={`/spotify/artists/${id}`}
      className="flex items-center hover:bg-neutral-800 py-1 px-2 rounded transition-all"
    >
      <img src={imageUrl} className="w-9 h-9 rounded-full mr-2 aspect-square" />
      <div>
        {name}
        <div className="text-xs font-extralight">
          {(followers || 0)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}{" "}
          followers
        </div>
      </div>
    </Link>
  );
}
