/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import { Device, Track } from "../types";
import {
  checkSavedTracks,
  getPlayerDevices,
  insertSavedTracks,
  removeSavedTracks,
  setPlayerDeviceId,
} from "../actions";
import {
  CheckIcon,
  Pause,
  Play,
  PlusIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { msConversion } from "../utils";
import { useCurrentTrack } from "../store";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface StateContext {
  uri: string;
  metadata: {
    context_description: string;
  };
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
  namespace Spotify {
    interface PlayerConfig {
      name: string;
      getOAuthToken: (callback: (token?: string) => void) => void;
      volume?: number;
    }

    type ListenerEventName = "player_state_changed" | "ready";

    class Player {
      constructor(config: PlayerConfig);

      connect(): Promise<boolean>;
      disconnect(): Promise<boolean>;

      addListener(
        eventName: string,
        event: (event: ListenerEventName) => void
      ): void;
      addListener(
        eventName: "ready",
        event: (event: { device_id: string }) => void
      ): void;

      getCurrentState(): Promise<void>;
      togglePlay(): void;
      nextTrack(): void;
      previousTrack(): void;
      seek(time: number): void;
      activateElement(): void;
    }
  }
}

interface Props {
  token?: string;
}

export function Player({ token }: Props) {
  const { setTrack } = useCurrentTrack();
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(
    undefined
  );
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [context, setContext] = useState<StateContext | undefined>();
  const [isSavedTrack, setIsSavedTrack] = useState<boolean>(false);

  useEffect(() => {
    function loadPlayer() {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.id = "spotify-player-web-ui";
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Custom Web Spotify UI",
          getOAuthToken: (cb) => cb(token),
        });
        setPlayer(player);

        player.addListener("ready", async ({ device_id }) => {
          const devices = await getPlayerDevices();
          await setPlayerDeviceId({ device_ids: [device_id] });

          setDevices(devices);
          setDeviceId(device_id);
        });

        player.addListener("player_state_changed", (state: any) => {
          if (!state) return;
          console.log(state);

          setCurrentTrack(state.track_window.current_track);
          setIsPaused(state.paused);
          setPosition(state.position);
          setDuration(state.duration);
          setContext(state.context);

          if (state.paused) {
            setTrack(undefined);
          } else {
            setTrack(state.track_window.current_track);
          }

          // player.getCurrentState().then((state) => {
          //   console.log({ state });
          // });
        });

        player.connect();
      };
    }

    const playerExists = document.getElementById("spotify-player-web-ui");
    if (!playerExists) loadPlayer();
  }, [token]);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isPaused) {
      clearInterval(interval);
    } else {
      interval = window.setInterval(() => {
        setPosition((prevPosition) => {
          const nextPosition = prevPosition + 1000;
          if (nextPosition >= duration) {
            clearInterval(interval);
            return duration;
          }
          return nextPosition;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [duration, isPaused]);

  useEffect(() => {
    async function runCheckSavedTracks() {
      if (currentTrack?.id) {
        const ids = [currentTrack.id];
        const savedTracks = await checkSavedTracks({ ids });
        setIsSavedTrack(savedTracks[0]);
      }
    }
    runCheckSavedTracks();
  }, [currentTrack?.id]);

  return (
    <>
      {devices.length > 0 && (
        <Select
          value={deviceId}
          onValueChange={async (currentDeviceId) => {
            setDeviceId(currentDeviceId);
            await setPlayerDeviceId({ device_ids: [currentDeviceId] });
          }}
        >
          <SelectTrigger className="w-full rounded-xl mb-8">
            <SelectValue placeholder="Spotify devices" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem value={device.id} key={device.id}>
                {device.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <AnimatePresence>
        {deviceId && currentTrack?.name && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative bg-black border border-gray-800 overflow-hidden rounded-xl mb-8"
          >
            <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
              <img
                src={currentTrack?.album?.images?.[1]?.url}
                className="w-full"
              />
            </div>
            <div className="absolute top-0 left-0 bg-black/40 w-full h-full z-10" />
            <div className="p-6 z-20 relative">
              {context?.metadata.context_description && (
                <div className="text-gray-300 text-center drop-shadow-md mb-6 text-xs font-extralight overflow-hidden truncate w-full">
                  {context?.metadata.context_description}
                </div>
              )}
              {currentTrack?.album?.images?.[2]?.url ? (
                <img
                  src={currentTrack?.album?.images?.[2]?.url}
                  className="bg-gray-700 shadow-2xl w-full aspect-square drop-shadow-md rounded-xl mb-6"
                  alt=""
                />
              ) : (
                <div className="shadow-2xl w-full aspect-square drop-shadow-md rounded-xl mb-6" />
              )}
              <div className="relative">
                <h3 className="font-bold text-xl text-white drop-shadow-md pr-12">
                  {currentTrack?.name}
                </h3>
                {isSavedTrack ? (
                  <Button
                    className="rounded-full absolute right-0 top-0"
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      await removeSavedTracks({ ids: [currentTrack.id] });
                      setIsSavedTrack(false);
                    }}
                  >
                    <CheckIcon />
                  </Button>
                ) : (
                  <Button
                    className="rounded-full absolute right-0 top-0"
                    size="icon"
                    variant="default"
                    onClick={async () => {
                      await insertSavedTracks({ ids: [currentTrack.id] });
                      setIsSavedTrack(true);
                    }}
                  >
                    <PlusIcon />
                  </Button>
                )}
              </div>

              {currentTrack?.artists && currentTrack?.artists?.length > 0 && (
                <div className="text-gray-300 text-base drop-shadow-md mb-6 pr-12">
                  {currentTrack?.artists.map((artist) => (
                    <Link
                      href={`/spotify/artists/${
                        artist.uri.split("artist:")[1]
                      }`}
                      className="mr-2 hover:underline hover:text-white"
                      key={artist.uri.split("artist:")[1]}
                    >
                      {artist.name}
                    </Link>
                  ))}
                </div>
              )}

              <Slider
                value={[position]}
                onValueChange={(values) => {
                  const newPosition = values[0];
                  if (newPosition !== position) {
                    setPosition(newPosition);
                  }
                }}
                onValueCommit={(event) => {
                  const time = event[0];
                  player?.seek(time);
                }}
                max={duration}
                step={1000}
                className="w-full mb-1"
              />

              <div className="mb-6 flex items-center justify-between">
                <div className="text-xs font-extralight">
                  {msConversion(position)}
                </div>
                <div className="text-xs font-extralight">
                  {msConversion(duration)}
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  className="rounded-full"
                  size="icon"
                  variant="ghost"
                  onClick={() => player?.previousTrack()}
                >
                  <SkipBackIcon />
                </Button>
                <Button
                  className="rounded-full"
                  size="icon"
                  onClick={() => player?.togglePlay()}
                >
                  {isPaused ? <Play /> : <Pause />}
                </Button>
                <Button
                  className="rounded-full"
                  size="icon"
                  variant="ghost"
                  onClick={() => player?.nextTrack()}
                >
                  <SkipForwardIcon />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
