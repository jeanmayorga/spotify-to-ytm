import axios, { AxiosError, AxiosInstance } from "axios";
import {
  UserProfile,
  Playlist,
  Track,
  ListResponse,
  Artist,
  Album,
  AlbumOut,
  SearchType,
  Device,
} from "./types";
import { refreshToken } from "./actions";
import { logger } from "~/lib/pino";

const cacheRecommendations: any = {};

export class SpotifyApi {
  private client: AxiosInstance;

  constructor(token?: string) {
    this.client = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    this.client.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error: AxiosError) {
        if (error?.response?.status === 401 && error.config) {
          console.log("401 error");
          const newAccessToken = await refreshToken();
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  async getRecommendedTracks(options: {
    seed_tracks?: string[];
    limit?: number;
  }) {
    interface Response {
      tracks: Track[];
    }
    try {
      const key = JSON.stringify(options);
      const saved = cacheRecommendations[key];

      if (saved) {
        logger.info(
          {
            options,
            response: saved.length,
            cache: true,
          },
          "getRecommendedTracks"
        );
        return saved as Track[];
      }

      const params = {
        seed_tracks: options.seed_tracks?.slice(0, 5)?.join(","),
        limit: options.limit,
      };

      const request = await this.client.get<Response>(`/recommendations`, {
        params,
      });

      logger.info(
        {
          options,
          response: request.data.tracks.length,
        },
        "getRecommendedTracks"
      );
      cacheRecommendations[key] = request.data.tracks;

      return request.data.tracks || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getRecommendedTracks");
      return [];
    }
  }

  async insertSavedTracks(options: { ids: string[] }) {
    try {
      await this.client.put("/me/tracks", null, {
        params: {
          ids: options.ids.join(","),
        },
      });

      logger.info({ options }, "insertSavedTracks");
      return true;
    } catch (error: any) {
      logger.error(error?.response?.data, "insertSavedTracks");
      return false;
    }
  }

  async removeSavedTracks(options: { ids: string[] }) {
    try {
      await this.client.delete("/me/tracks", {
        params: {
          ids: options.ids.join(","),
        },
      });

      logger.info({ options }, "removeSavedTracks");
      return true;
    } catch (error: any) {
      logger.error(error?.response?.data, "removeSavedTracks");
      return false;
    }
  }

  async checkSavedTracks(options: { ids: string[] }) {
    try {
      const request = await this.client.get<boolean[]>("/me/tracks/contains", {
        params: {
          ids: options.ids.join(","),
        },
      });
      const response = request.data;

      logger.info({ options }, "checkSavedTracks");
      return response;
    } catch (error: any) {
      logger.error(error?.response?.data, "checkSavedTracks");
      return [];
    }
  }

  async getProfile() {
    try {
      const request = await this.client.get<UserProfile>(`/me`);
      logger.info(
        { response: { id: request.data.id, name: request.data.display_name } },
        "getProfile"
      );

      return request.data;
    } catch (error: any) {
      logger.error(error?.response?.data, "getProfile");
      return null;
    }
  }

  async getProfileTopTracks(options: {
    timeRange?: "long_term" | "medium_term" | "short_term";
    limit?: number;
  }) {
    try {
      const request = await this.client.get<ListResponse<Track>>(
        `/me/top/tracks`,
        {
          params: {
            time_range: options.timeRange,
            limit: options.limit,
          },
        }
      );

      logger.info(
        {
          options,
          response: request.data.items.length,
        },
        "getProfileTopTracks"
      );
      return request.data.items || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getProfileTopTracks");
      return [];
    }
  }

  async getProfilePlaylists(options?: { limit?: number }) {
    try {
      const request = await this.client.get<ListResponse<Playlist>>(
        `/me/playlists`,
        { params: { limit: options?.limit } }
      );
      logger.info(
        {
          options,
          response: request.data.items.length,
        },
        "getProfilePlaylists"
      );
      return request.data.items || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getProfilePlaylists");
      return [];
    }
  }

  async getProfileFeaturePlaylists(options?: { limit?: number }) {
    try {
      interface Response {
        playlists: ListResponse<Playlist>;
      }
      const request = await this.client.get<Response>(
        `/browse/featured-playlists`,
        {
          params: { limit: options?.limit },
        }
      );

      logger.info(
        { options, response: request.data.playlists.items.length },
        "getProfileFeaturePlaylists"
      );
      return request.data.playlists.items || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getProfileFeaturePlaylists");
      return [];
    }
  }

  async getRecentlyPlayedTracks(options?: { limit?: number }) {
    try {
      interface PlayHistoryObject {
        track: Track;
        played_at: string;
      }
      const request = await this.client.get<ListResponse<PlayHistoryObject>>(
        `/me/player/recently-played`,
        { params: { limit: options?.limit } }
      );
      const mapped: Track[] =
        request.data.items.map((item) => ({
          ...item.track,
          played_at: item.played_at,
        })) || [];

      logger.info(
        { options, response: mapped.length },
        "getRecentlyPlayedTracks"
      );
      return mapped;
    } catch (error: any) {
      logger.error(error?.response?.data, "getRecentlyPlayedTracks");
      return [];
    }
  }

  async getSavedTracks(options?: { limit?: number }) {
    try {
      interface PlayHistoryObject {
        track: Track;
        added_at: string;
      }
      const request = await this.client.get<ListResponse<PlayHistoryObject>>(
        `/me/tracks`,
        { params: { limit: options?.limit } }
      );
      const mapped: Track[] =
        request.data.items.map((item) => ({
          ...item.track,
          added_at: item.added_at,
        })) || [];

      logger.info({ options, response: mapped.length }, "getSavedTracks");
      return mapped || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getSavedTracks");
      return [];
    }
  }

  async getPlaylist(options: { id: string }) {
    try {
      const request = await this.client.get<Playlist>(
        `/playlists/${options.id}`
      );
      logger.info(
        {
          options,
          response: {
            id: request.data.id,
            name: request.data.name,
          },
        },
        "getPlaylist"
      );
      return request.data;
    } catch (error: any) {
      logger.error(error?.response?.data, "getPlaylist");
      return undefined;
    }
  }

  async getArtist(options: { id: string }) {
    try {
      const request = await this.client.get<Artist>(`/artists/${options.id}`);
      logger.info(
        {
          options,
          response: {
            id: request.data.id,
            name: request.data.name,
          },
        },
        "getArtist"
      );
      return request.data;
    } catch (error: any) {
      logger.error(error?.response?.data, "getArtist");
      return undefined;
    }
  }
  async getArtistTopTracks(options: { id: string }) {
    try {
      interface Response {
        tracks: Track[];
      }
      const request = await this.client.get<Response>(
        `/artists/${options.id}/top-tracks`
      );
      logger.info(
        {
          options,
          response: request.data.tracks.length,
        },
        "getArtistTopTracks"
      );
      return request.data.tracks || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getArtistTopTracks");
      return [];
    }
  }
  async getArtistAlbums(options: { id: string; limit?: number }) {
    try {
      const request = await this.client.get<ListResponse<Album>>(
        `/artists/${options.id}/albums`,
        {
          params: { limit: options.limit },
        }
      );
      logger.info(
        {
          options,
          response: request.data.items.length,
        },
        "getArtistAlbums"
      );
      return request.data.items || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getArtistAlbums");
      return [];
    }
  }
  async getArtistRelatedArtists(options: { id: string }) {
    try {
      interface Response {
        artists: Artist[];
      }
      const request = await this.client.get<Response>(
        `/artists/${options.id}/related-artists`
      );
      logger.info(
        {
          options,
          response: request.data.artists.length,
        },
        "getArtistRelatedArtists"
      );
      return request.data.artists || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getArtistRelatedArtists");
      return [];
    }
  }

  async getAlbum(options: { id: string }) {
    try {
      const request = await this.client.get<Album>(`/albums/${options.id}`);
      logger.info(
        {
          options,
          response: {
            id: request.data.id,
            name: request.data.name,
          },
        },
        "getAlbum"
      );
      return request.data;
    } catch (error: any) {
      logger.error(error?.response?.data, "getAlbum");
      return undefined;
    }
  }

  async getAlbumTracks(options: { id: string; limit?: number }) {
    try {
      const request = await this.client.get<ListResponse<Track>>(
        `/albums/${options.id}/tracks`,
        {
          params: {
            limit: options.limit,
          },
        }
      );
      logger.info(
        {
          options,
          response: request.data.items.length,
        },
        "getAlbumTracks"
      );
      return request.data.items || [];
    } catch (error: any) {
      logger.error(error?.response?.data, "getAlbumTracks");
      return [];
    }
  }

  async search(options: { q: string; type: SearchType[]; limit: number }) {
    interface Response {
      albums: ListResponse<Album>;
      artists: ListResponse<Artist>;
      playlists: ListResponse<Playlist>;
      tracks: ListResponse<Track>;
    }
    try {
      if (!options.q.length) {
      }
      const request = await this.client.get<Response>("/search", {
        params: {
          q: options.q,
          limit: options.limit,
          type: options.type.join(","),
        },
      });

      logger.info(
        {
          options,
          response: {
            albums: request?.data?.albums?.items?.length || 0,
            artists: request?.data?.artists?.items?.length || 0,
            playlists: request?.data?.playlists?.items?.length || 0,
            tracks: request?.data?.tracks?.items?.length || 0,
          },
        },
        "search"
      );
      return request.data;
    } catch (error: any) {
      const emptyResponse = {
        href: "",
        limit: 0,
        next: "",
        offset: 0,
        previous: "",
        total: 0,
        items: [],
      };

      logger.error(error?.response?.data, "search");

      return {
        albums: emptyResponse,
        artists: emptyResponse,
        playlists: emptyResponse,
        tracks: emptyResponse,
      };
    }
  }

  async play(options?: { context_uri?: string; uris?: string[] }) {
    try {
      await this.client.put(`/me/player/play`, options);
      logger.info({ options }, "play");
      return true;
    } catch (error: any) {
      logger.error(error?.response?.data, "play");
      return false;
    }
  }

  async getPlayerDevices() {
    interface Response {
      devices: Device[];
    }
    try {
      const request = await this.client.get<Response>(`/me/player/devices`);

      logger.info({ devices: request.data.devices.length }, "getPlayerDevices");
      return request.data.devices;
    } catch (error: any) {
      logger.error(error?.response?.data, "getPlayerDevices");
      return [];
    }
  }
  async setPlayerDevice(options: { device_ids: string[] }) {
    try {
      await this.client.put<Response>(`/me/player`, options);
      logger.info({ options }, "setPlayerDevice");
      return true;
    } catch (error: any) {
      logger.error(error?.response?.data, "setPlayerDevice");
      return false;
    }
  }
}
