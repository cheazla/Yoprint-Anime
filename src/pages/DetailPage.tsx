import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimeDetails } from "../store/animeSlice";
import { AppDispatch, RootState } from "../store";
import "./DetailPage.css";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAnime, loading, error } = useSelector(
    (state: RootState) => state.anime
  );

  useEffect(() => {
    if (id) dispatch(fetchAnimeDetails(Number(id)));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="detail-container">
        <div className="bg-pattern"></div>
        <div className="content-wrapper">
          <p className="loading-text">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="bg-pattern"></div>
        <div className="content-wrapper">
          <Link to="/" className="back-button">
            ⬅ Back to Search
          </Link>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedAnime) {
    return (
      <div className="detail-container">
        <div className="bg-pattern"></div>
        <div className="content-wrapper">
          <Link to="/" className="back-button">
            ⬅ Back to Search
          </Link>
          <p className="error-text">No anime details available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="bg-pattern"></div>
      <div className="content-wrapper">
        <Link to="/" className="back-button">
          ⬅ Back to Search
        </Link>

        <div className="detail-box">
          <h1 className="title">{selectedAnime.title}</h1>

          <div className="content-grid">
            <div className="image-section">
              <img
                src={selectedAnime.images?.jpg?.image_url}
                alt={selectedAnime.title}
                className="anime-image"
              />
            </div>

            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Episodes</div>
                  <div className="info-value">
                    {selectedAnime.episodes ?? "N/A"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Score</div>
                  <div className="info-value">
                    ⭐ {selectedAnime.score ?? "N/A"}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Type</div>
                  <div className="info-value">
                    {selectedAnime.type ?? "N/A"}
                  </div>
                </div>

                {selectedAnime.status && (
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">{selectedAnime.status}</div>
                  </div>
                )}
              </div>

              {selectedAnime.synopsis && (
                <div className="info-card">
                  <h2 className="section-title">Synopsis</h2>
                  <p className="synopsis">{selectedAnime.synopsis}</p>
                </div>
              )}

              {Array.isArray(selectedAnime.genres) &&
                selectedAnime.genres.length > 0 && (
                  <div className="genre-list">
                    {selectedAnime.genres.map((g) => (
                      <span key={g.mal_id} className="genre-badge">
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
