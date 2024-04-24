import Link from "next/link";

import { Album } from "../types";

interface Props {
  title?: string;
  albums?: Album[];
}
export function AlbumsList({ title, albums }: Props) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {title || "Albums"}
        </h2>
      </div>
      <section className="grid grid-cols-7">
        {albums?.map((album) => (
          <Link
            href={`/spotify/albums/${album?.id}`}
            key={album.id}
            className="hover:bg-[#282828] rounded p-3 transition-all cursor-pointer"
          >
            <img
              src={album?.images?.[0]?.url}
              className="rounded mb-4 w-full aspect-square"
              alt="cover"
            />
            <h3 className="font-medium text-base text-white overflow-hidden truncate w-36">
              {album?.name}
            </h3>
            <p className="font-light text-sm text-[#a7a7a7]">
              {album?.album_type} {album?.release_date?.split("-")[0]}
            </p>
          </Link>
        ))}
      </section>
    </section>
  );
}
