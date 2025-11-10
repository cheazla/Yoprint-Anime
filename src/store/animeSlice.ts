import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Anime } from "../types/anime";
import {
  searchAnime,
  fetchAnimeDetailsApi,
  fetchTopAnime,
} from "../api/jikanApi";

interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  trending: Anime[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  trending: [],
  currentPage: 1,
  hasMore: true,
  loading: false,
  error: null,
};

let cancelTokenSource: any = null;

// Search with cancel token
export const fetchAnime = createAsyncThunk(
  "anime/fetchAnime",
  async ({ query, page }: { query: string; page: number }) => {
    if (cancelTokenSource)
      cancelTokenSource.cancel("Cancelled previous request.");
    cancelTokenSource = axios.CancelToken.source();
    const data = await searchAnime(query, page, cancelTokenSource.token);
    return { data, page };
  }
);

export const fetchAnimeDetails = createAsyncThunk(
  "anime/fetchAnimeDetails",
  async (id: number) => {
    const data = await fetchAnimeDetailsApi(id);
    return data;
  }
);

export const fetchTrendingAnime = createAsyncThunk(
  "anime/fetchTrendingAnime",
  async () => {
    const data = await fetchTopAnime();
    return data;
  }
);

const animeSlice = createSlice({
  name: "anime",
  initialState,
  reducers: {
    resetSearch(state) {
      state.searchResults = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        if (page === 1) state.searchResults = data;
        else state.searchResults = [...state.searchResults, ...data];
        state.currentPage = page;
        state.hasMore = data.length > 0;
        state.loading = false;
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        if (axios.isCancel(action.error)) return;
        state.loading = false;
        state.error = "Failed to fetch anime";
      })

      // Details
      .addCase(fetchAnimeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
        state.selectedAnime = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnimeDetails.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch anime details";
      })

      // Trending
      .addCase(fetchTrendingAnime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingAnime.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrendingAnime.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetSearch } = animeSlice.actions;
export default animeSlice.reducer;
