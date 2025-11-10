import axios, { CancelToken } from "axios";
import { Anime } from "../types/anime";

const BASE_URL = "https://api.jikan.moe/v4";

export const searchAnime = async (
  query: string,
  page: number = 1,
  cancelToken?: CancelToken
): Promise<Anime[]> => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: { q: query, limit: 10, page },
    cancelToken,
  });
  return res.data.data.map((a: any) => ({
    mal_id: a.mal_id,
    title: a.title,
    synopsis: a.synopsis ?? "",
    images: a.images,
    episodes: a.episodes,
    score: a.score,
    type: a.type,
  }));
};

export const fetchAnimeDetailsApi = async (id: number): Promise<Anime> => {
  const res = await axios.get(`${BASE_URL}/anime/${id}`);
  const a = res.data.data;
  return {
    mal_id: a.mal_id,
    title: a.title,
    synopsis: a.synopsis ?? "",
    images: a.images,
    episodes: a.episodes,
    score: a.score,
    type: a.type,
  };
};

export const fetchTopAnime = async (): Promise<Anime[]> => {
  const res = await axios.get(`${BASE_URL}/top/anime`, {
    params: { limit: 10 },
  });
  return res.data.data.map((a: any) => ({
    mal_id: a.mal_id,
    title: a.title,
    synopsis: a.synopsis ?? "",
    images: a.images,
    episodes: a.episodes,
    score: a.score,
    type: a.type,
  }));
};
