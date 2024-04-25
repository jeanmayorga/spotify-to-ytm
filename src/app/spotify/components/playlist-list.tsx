"use client";
import { Playlist } from "../types";
import { PlaylistItem } from "./playlist-item";

interface Props {
  playlists?: Playlist[];
}
export function PlaylistList({ playlists }: Props) {
  console.log({ playlists });
  return (
    <section className="mb-8">
      <section className="grid grid-cols-7">
        {playlists?.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            id={playlist.id}
            imageUrl={playlist?.images?.[0]?.url}
            name={playlist.name}
            displayName={playlist.public ? "Publica" : "No publica"}
          />
        ))}
      </section>
    </section>
  );
}
