import React, { useState } from "react";
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
  onSearch,
  suggestions,
  onSelectSuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search anime..."
        style={{ width: "100%", padding: "8px" }}
      />
      <button onClick={onSearch} style={{ marginLeft: "10px" }}>
        Search
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {suggestions.map((anime) => (
            <li
              key={anime.mal_id}
              onClick={() => {
                setQuery(anime.title);
                setShowSuggestions(false);
                onSelectSuggestion(anime.title);
              }}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {anime.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
