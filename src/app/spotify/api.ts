import axios, { AxiosInstance } from "axios";
import { UserProfile, Playlist, Track, Search, ListResponse } from "./types";

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
  }

  async getProfile() {
    try {
      const request = await this.client.get<UserProfile>(`/me`);
      console.log(`get profile`, request.data.id);
      return request.data;
    } catch (error: any) {
      console.log(`error get profile`, error.response.data);
      return null;
    }
  }

  async getProfilePlaylists(options?: { limit?: number }) {
    try {
      const request = await this.client.get<ListResponse<Playlist>>(
        `/me/playlists`,
        { params: { limit: options?.limit } }
      );
      console.log(`get profile playlist`, request.data.items.length);
      return request.data.items || [];
    } catch (error: any) {
      console.log(`error get profile playlist`, error.response.data);
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
      return request.data.playlists.items || [];
    } catch (error: any) {
      console.log(`error get profile playlist`, error.response.data);
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
      console.log(`get recently played tracks`, request.data.items.length);
      return request.data.items || [];
    } catch (error: any) {
      console.log(`error recently played tracks`, error.response.data);
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
      console.log(`get saved tracks`, request.data.items.length);
      return request.data.items || [];
    } catch (error: any) {
      console.log(`error get saved tracks`, error.response.data);
      return [];
    }
  }

  async getPlaylist(options: { id: string }) {
    try {
      const request = await this.client.get<Playlist>(
        `/playlists/${options.id}`
      );
      console.log(`get playlist ${options.id}`, request.data.name);
      return request.data;
    } catch (error: any) {
      console.log(`error get playlist ${options.id}`, error.response.data);
      return undefined;
    }
  }

  // not used
  async getTracks(options: { id: string }) {
    try {
      const request = await this.client.get<Track>(`/tracks/${options.id}`);
      console.log(`get track ${options.id}`, request.data.name);
      return request.data;
    } catch (error: any) {
      console.log(`error get track ${options.id}`, error.response.data);
      return null;
    }
  }

  // not used
  async getPlaylists(options: { query: string }) {
    try {
      const request = await this.client.get<Search<Playlist[]>>(`/search`, {
        params: {
          type: "playlist",
          limit: "50",
          q: options.query,
        },
      });
      console.log(
        `get playlist ${options.query}`,
        request.data.playlists.items.length
      );
      return request.data.playlists.items;
    } catch (error: any) {
      console.log(`error get playlists ${options.query}`, error.response.data);
      return [];
    }
  }
}
