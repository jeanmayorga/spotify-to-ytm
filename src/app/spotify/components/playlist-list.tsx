import Link from "next/link";

import { Playlist } from "../types";

interface Props {
  title: string;
  playlists?: Playlist[];
}
export function PlaylistList({ playlists, title }: Props) {
  return (
    <section className="px-4 mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <div className="text-sm">See all playlists</div>
      </div>
      <section className="grid grid-cols-7">
        {playlists?.map((playlist) => (
          <Link
            href={`/spotify/playlists/${playlist.id}`}
            key={playlist.id}
            className="hover:bg-[#282828] rounded p-3 transition-all cursor-pointer"
          >
            <img
              src={playlist.images[0].url}
              className="rounded mb-4 w-full aspect-square"
              alt="cover"
            />
            <h3 className="font-medium text-base text-white overflow-hidden truncate w-36">
              {playlist.name}
            </h3>
            <p className="font-light text-sm text-[#a7a7a7]">
              {playlist.owner.display_name}
            </p>
          </Link>
        ))}
      </section>
    </section>
  );
}
