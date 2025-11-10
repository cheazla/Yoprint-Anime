import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchAnime,
  resetSearch,
  fetchTrendingAnime,
} from "../store/animeSlice";
import SearchBar from "../components/SearchBar";
import AnimeList from "../components/AnimeList";

// Simple debounce function
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, trending, loading, error, currentPage, hasMore } =
    useSelector((state: RootState) => state.anime);

  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(fetchTrendingAnime());
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce(
      (q: string, page: number) => dispatch(fetchAnime({ query: q, page })),
      250
    ),
    []
  );

  useEffect(() => {
    if (query.trim() === "") return;
    setHasSearched(true);
    dispatch(resetSearch());
    debouncedSearch(query, 1);
  }, [query, dispatch, debouncedSearch]);

  const loadMore = () => {
    if (!loading && hasMore) debouncedSearch(query, currentPage + 1);
  };

  const suggestions = query.trim() === "" ? trending : searchResults;
  const hasResults = Array.isArray(searchResults) && searchResults.length > 0;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Anime Search</h1>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={() => {}}
        suggestions={suggestions}
        onSelectSuggestion={(title) => setQuery(title)}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {hasSearched ? (
        hasResults ? (
          <>
            <AnimeList animes={searchResults} hasSearched={false} />
            {hasMore && (
              <button onClick={loadMore}>
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        ) : (
          !loading && <p>No results found.</p>
        )
      ) : (
        <p>Trending Anime Recommendations:</p>
      )}
    </div>
  );
};

export default SearchPage;
