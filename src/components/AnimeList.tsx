import { Anime } from "../types/anime";
import AnimeCard from "./AnimeCard";

interface Props {
  animes?: Anime[];
  hasSearched: boolean;
}

const AnimeList = ({ animes = [], hasSearched }: Props) => {
  if (!hasSearched) {
    return <p>Type a keyword and click "Search" to begin.</p>;
  }

  if (animes.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {animes.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeList;
