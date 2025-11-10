import { Link } from "react-router-dom";
import { Anime } from "../types/anime";

interface Props {
  anime: Anime;
}

const AnimeCard = ({ anime }: Props) => (
  <div
    style={{
      border: "1px solid #ccc",
      margin: 10,
      padding: 10,
      width: 200,
      textAlign: "center",
    }}
  >
    <img
      src={anime.images?.jpg?.image_url}
      alt={anime.title}
      style={{ width: "100%", height: "250px", objectFit: "cover" }}
    />
    <h3>{anime.title}</h3>
    <p>Score: {anime.score ?? "N/A"}</p>
    <Link to={`/anime/${anime.mal_id}`}>View Details</Link>
  </div>
);

export default AnimeCard;
