import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimeDetails } from "../store/animeSlice";
import { AppDispatch, RootState } from "../store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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

  return (
    <div className="detail-container">
      <div className="bg-pattern"></div>
      <div className="content-wrapper">
        <Link to="/" className="back-button">
          ⬅ Back to Search
        </Link>

        {loading && (
          <div className="detail-box">
            <Skeleton height={40} width={`60%`} />
            <div className="content-grid">
              <div className="image-section">
                <Skeleton height={300} width={220} />
              </div>
              <div className="info-section">
                <Skeleton height={20} count={6} style={{ marginBottom: 8 }} />
                <Skeleton height={80} style={{ marginTop: 16 }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p className="error-text">{error}</p>
            <button
              className="btn-refresh"
              onClick={() => id && dispatch(fetchAnimeDetails(Number(id)))}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !selectedAnime && (
          <div className="empty-state">
            <img
              src="/no-results.png"
              alt="No details"
              className="empty-image"
            />
            <p>No details available for this anime.</p>
            <Link to="/" className="btn-refresh">
              Back to Search
            </Link>
          </div>
        )}

        {!loading && !error && selectedAnime && (
          <div className="detail-box">
            <h1 className="title">{selectedAnime.title}</h1>
            <div className="content-grid">
              <div className="image-section">
                <img
                  src={
                    selectedAnime.images?.jpg?.image_url ||
                    "https://via.placeholder.com/220x300"
                  }
                  alt={selectedAnime.title}
                  className="anime-imagex"
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
        )}
      </div>
    </div>
  );
};

export default DetailPage;
