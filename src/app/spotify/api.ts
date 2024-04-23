import axios, { AxiosInstance } from "axios";
import {
  UserProfile,
  Playlist,
  Track,
  Search,
  ListResponse,
  Artist,
  Album,
  AlbumOut,
} from "./types";

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

  async getProfileSavedAlbums(options?: { limit?: number }) {
    try {
      const request = await this.client.get<ListResponse<AlbumOut>>(
        `/me/albums`,
        {
          params: { limit: options?.limit },
        }
      );
      console.log(`get profile albums`, request.data.items.length);
      const mappedAlbums = request.data.items.map((item) => ({
        ...item.album,
      }));
      return mappedAlbums || [];
    } catch (error: any) {
      console.log(`error get profile albums`, error.response.data);
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

  async getArtist(options: { id: string }) {
    try {
      const request = await this.client.get<Artist>(`/artists/${options.id}`);
      console.log(`get artist ${options.id}`, request.data.name);
      return request.data;
    } catch (error: any) {
      console.log(`error get artist ${options.id}`, error.response.data);
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
      console.log(
        `get artist ${options.id} tracks`,
        request.data.tracks.length
      );
      return request.data.tracks || [];
    } catch (error: any) {
      console.log(`error get artist ${options.id} tracks`, error.response.data);
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
      console.log(`get artist ${options.id} albums`, request.data.items.length);
      return request.data.items || [];
    } catch (error: any) {
      console.log(`error get artist ${options.id} albums`, error.response.data);
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
      console.log(
        `get artist ${options.id} related artists`,
        request.data.artists.length
      );
      return request.data.artists || [];
    } catch (error: any) {
      console.log(
        `error get artist ${options.id} related artists`,
        error.response.data
      );
      return [];
    }
  }

  async getAlbum(options: { id: string }) {
    try {
      const request = await this.client.get<Album>(`/albums/${options.id}`);
      console.log(`get album ${options.id}`, request.data.name);
      return request.data;
    } catch (error: any) {
      console.log(`error get album ${options.id}`, error.response.data);
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
      console.log(`get album ${options.id} tracks`, request.data.items.length);
      return request.data.items || [];
    } catch (error: any) {
      console.log(`error get album ${options.id} tracks`, error.response.data);
      return [];
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
