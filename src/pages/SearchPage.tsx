import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import {
  fetchAnime,
  resetSearch,
  fetchTrendingAnime,
} from "../store/animeSlice";
import SearchBar from "../components/SearchBar";
import "./SearchPage.css";

function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { searchResults, trending, loading, error, currentPage, hasMore } =
    useSelector((state: RootState) => state.anime);

  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchTrendingAnime());
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce(
      (q: string, page: number) => dispatch(fetchAnime({ query: q, page })),
      250
    ),
    [dispatch]
  );

  useEffect(() => {
    if (query.trim() === "") {
      setShowSuggestions(false);
      return;
    }
    setHasSearched(true);
    dispatch(resetSearch());
    debouncedSearch(query, 1);
    setShowSuggestions(true);
  }, [query, dispatch, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) debouncedSearch(query, currentPage + 1);
  };

  const suggestions = query.trim() === "" ? trending : searchResults;
  const hasResults = Array.isArray(searchResults) && searchResults.length > 0;

  const toggleDescription = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) newExpanded.delete(index);
    else newExpanded.add(index);
    setExpandedCards(newExpanded);
  };

  const truncateText = (text: string, maxLength: number) =>
    !text
      ? ""
      : text.length > maxLength
      ? text.slice(0, maxLength) + "..."
      : text;

  const renderAnimeCard = (anime: any, index: number) => {
    const isExpanded = expandedCards.has(index);
    const description =
      anime.synopsis || anime.description || "No description available";
    const needsReadMore = description.length > 80;

    return (
      <div
        key={anime.mal_id || index}
        className={`anime-card ${hoveredCard === index ? "hovered" : ""}`}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => navigate(`/anime/${anime.mal_id}`)}
      >
        <img
          src={
            anime.images?.jpg?.image_url ||
            anime.image_url ||
            "https://via.placeholder.com/100"
          }
          alt={anime.title}
          className="anime-image"
        />
        <div className="anime-title">{truncateText(anime.title, 30)}</div>
        <div className="anime-description">
          {isExpanded ? description : truncateText(description, 80)}
        </div>
        {needsReadMore && (
          <button
            className="read-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleDescription(index);
            }}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="search-container">
      <div className="bg-pattern"></div>
      <div className="content-wrapper">
        <div className="header">
          <h1 className="heading">ANIME SEARCH</h1>
          <p className="subtitle">Discover your next favorite anime</p>
        </div>

        <div ref={searchBarRef} className="search-bar-wrapper">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={() => {}}
            suggestions={showSuggestions ? suggestions : []}
            onSelectSuggestion={(title) => setQuery(title)}
          />
        </div>

        {loading && <p className="loading-text">Loading amazing anime...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="results-container">
          <h2 className="section-title">
            {hasSearched && hasResults ? "Search Results" : "Trending Anime"}
          </h2>

          {hasSearched ? (
            hasResults ? (
              <>
                <div className="anime-grid">
                  {searchResults.map((anime, index) =>
                    renderAnimeCard(anime, index)
                  )}
                </div>
                {hasMore && (
                  <button
                    className={`load-btn ${btnHover ? "hover" : ""}`}
                    onClick={loadMore}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </>
            ) : (
              !loading && (
                <p className="no-results">
                  No results found. Try a different search!
                </p>
              )
            )
          ) : (
            <div className="anime-grid">
              {trending.map((anime, index) => renderAnimeCard(anime, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
