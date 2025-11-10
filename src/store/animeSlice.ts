import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { CancelTokenSource } from "axios";

interface Genre {
  mal_id: number;
  name: string;
}

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
  episodes: number | null;
  score: number | null;
  type: string;
  status?: string;
  genres?: Genre[];
}

interface AnimeState {
  searchResults: Anime[];
  trending: Anime[];
  selectedAnime: Anime | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

let cancelToken: CancelTokenSource | null = null;

const initialState: AnimeState = {
  searchResults: [],
  trending: [],
  selectedAnime: null,
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
};

export const fetchAnime = createAsyncThunk<
  { data: Anime[]; page: number; hasMore: boolean },
  { query: string; page?: number },
  { rejectValue: string }
>("anime/fetchAnime", async ({ query, page = 1 }, { rejectWithValue }) => {
  try {
    if (cancelToken) {
      cancelToken.cancel("Request canceled due to new search");
    }
    cancelToken = axios.CancelToken.source();

    const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
      params: { q: query, page, limit: 12 },
      cancelToken: cancelToken.token,
    });

    const hasMore = res.data.pagination.has_next_page;
    const data = res.data.data.map((a: any) => ({
      mal_id: a.mal_id,
      title: a.title,
      synopsis: a.synopsis ?? "",
      images: a.images,
      episodes: a.episodes ?? null,
      score: a.score ?? null,
      type: a.type ?? "Unknown",
      status: a.status ?? "",
      genres: a.genres ?? [],
    }));

    return { data, page, hasMore };
  } catch (err: any) {
    if (axios.isCancel(err)) return rejectWithValue("Request canceled");
    return rejectWithValue("Failed to fetch anime");
  }
});

export const fetchTrendingAnime = createAsyncThunk<
  Anime[],
  void,
  { rejectValue: string }
>("anime/fetchTrendingAnime", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("https://api.jikan.moe/v4/top/anime", {
      params: { limit: 12 },
    });
    return res.data.data.map((a: any) => ({
      mal_id: a.mal_id,
      title: a.title,
      synopsis: a.synopsis ?? "",
      images: a.images,
      episodes: a.episodes ?? null,
      score: a.score ?? null,
      type: a.type ?? "Unknown",
      status: a.status ?? "",
      genres: a.genres ?? [],
    }));
  } catch {
    return rejectWithValue("Failed to fetch trending anime");
  }
});

export const fetchAnimeDetails = createAsyncThunk<
  Anime,
  number,
  { rejectValue: string }
>("anime/fetchAnimeDetails", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
    const a = res.data.data;
    return {
      mal_id: a.mal_id,
      title: a.title,
      synopsis: a.synopsis ?? "",
      images: a.images,
      episodes: a.episodes ?? null,
      score: a.score ?? null,
      type: a.type ?? "Unknown",
      status: a.status ?? "Unknown",
      genres: a.genres ?? [],
    };
  } catch {
    return rejectWithValue("Failed to fetch anime details");
  }
});

const animeSlice = createSlice({
  name: "anime",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.searchResults = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.searchResults = action.payload.data;
        } else {
          state.searchResults.push(...action.payload.data);
        }
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "Request canceled") {
          state.error = action.payload || "Error searching anime";
        }
      });

    builder
      .addCase(fetchTrendingAnime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingAnime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load trending anime";
      });

    builder
      .addCase(fetchAnimeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error loading anime details";
      });
  },
});

export const { resetSearch } = animeSlice.actions;
export default animeSlice.reducer;
