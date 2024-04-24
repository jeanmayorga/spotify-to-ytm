import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Track } from "./types";

interface TrackState {
  track: Track | undefined;
  setTrack: (track?: Track) => void;
}

export const useCurrentTrack = create(
  persist<TrackState>(
    (set, get) => ({
      track: undefined,
      setTrack: (track) => set(() => ({ track })),
    }),
    {
      name: "track-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
