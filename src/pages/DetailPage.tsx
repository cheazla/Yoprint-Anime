import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimeDetails } from "../store/animeSlice";
import { AppDispatch, RootState } from "../store";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAnime, loading, error } = useSelector(
    (state: RootState) => state.anime
  );

  useEffect(() => {
    if (id) dispatch(fetchAnimeDetails(Number(id)));
  }, [id, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!selectedAnime) return <p>No details available</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Link to="/">⬅ Back</Link>
      <h1>{selectedAnime.title}</h1>
      <img
        src={selectedAnime.images.jpg.image_url}
        alt={selectedAnime.title}
        width={300}
      />
      <p>{selectedAnime.synopsis}</p>
      <p>Episodes: {selectedAnime.episodes ?? "N/A"}</p>
      <p>Score: {selectedAnime.score ?? "N/A"}</p>
      <p>Type: {selectedAnime.type ?? "N/A"}</p>
    </div>
  );
};

export default DetailPage;
