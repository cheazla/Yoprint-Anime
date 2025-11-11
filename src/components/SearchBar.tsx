import React, { useState, useRef, useEffect } from "react";
import { Anime } from "../types/anime";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  suggestions: Anime[];
  onSelectSuggestion: (title: string) => void;
}

const SearchBar: React.FC<Props> = ({
  query,
  setQuery,
  suggestions,
  onSelectSuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styles = {
    container: {
      position: "relative" as const,
      width: "80%",
      maxWidth: "clamp(300px, 80vw, 500px)",
      margin: "0 auto",
    },
    searchWrapper: {
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "clamp(48px, 10vw, 56px)",
      backgroundColor: isFocused
        ? "rgba(255, 255, 255, 0.22)"
        : "rgba(255, 255, 255, 0.15)",
      borderRadius: "100px",
      padding: "0 clamp(15px, 3vw, 20px)",
      gap: "clamp(10px, 2vw, 12px)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: isFocused
        ? "2px solid rgba(255, 215, 0, 0.5)"
        : "2px solid rgba(255, 255, 255, 0.25)",
      boxShadow: isFocused
        ? "0 8px 32px rgba(255, 215, 0, 0.2), 0 0 0 4px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
        : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isFocused ? "translateY(-2px)" : "translateY(0)",
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      color: "#ffffff",
      fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
      fontWeight: "500",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      padding: 0,
      minWidth: 0,
    },
    clearButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "clamp(28px, 6vw, 32px)",
      height: "clamp(28px, 6vw, 32px)",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      flexShrink: 0,
      padding: 0,
    },
    suggestionsList: {
      position: "absolute" as const,
      top: "calc(100% + 10px)",
      left: 0,
      right: 0,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      listStyle: "none",
      margin: 0,
      padding: "8px",
      maxHeight: "300px",
      overflowY: "auto" as const,
      zIndex: 10,
      borderRadius: "clamp(12px, 3vw, 20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    },
    suggestionItem: {
      padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
      cursor: "pointer",
      borderRadius: "clamp(8px, 2vw, 12px)",
      transition: "all 0.2s ease",
      fontSize: "clamp(0.9rem, 2vw, 0.95rem)",
      color: "#2c2e3e",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <div style={styles.iconWrapper}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: "#ffd700",
              width: "clamp(18px, 4vw, 22px)",
              height: "clamp(18px, 4vw, 22px)",
              filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.3))",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="search"
          aria-label="Search for anime"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search anime..."
          style={styles.input}
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            onMouseDown={(e) => e.preventDefault()}
            style={styles.clearButton}
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
          {suggestions.map((anime) => (
            <li
              key={anime.mal_id}
              onClick={() => {
                setQuery(anime.title);
                setShowSuggestions(false);
                onSelectSuggestion(anime.title);
              }}
              onMouseDown={(e) => e.preventDefault()}
              style={styles.suggestionItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 215, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {anime.title}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        input[type="search"]::-webkit-search-cancel-button {
          display: none;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        ul::-webkit-scrollbar {
          width: 8px;
        }

        ul::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        ul::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 10px;
        }

        ul::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
