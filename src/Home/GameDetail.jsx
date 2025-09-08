import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../data.json";
import "../styles/GameDetail.css";

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = data.find((g) => g.id.toString() === id);

  if (!game) {
    return (
      <div className="game-detail not-found">
        <h2>Game not found</h2>
        <button onClick={() => navigate("/home")} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="game-detail">
      <header className="detail-header">
        <button onClick={() => navigate("/home")} className="back-btn">
          ← Back
        </button>
      </header>

      {/* Top Section */}
      <div className="detail-content">
        <div className="detail-image">
          <img src={game.img} alt={game.title} />
        </div>
        <div className="detail-info">
          <h2>{game.title}</h2>
          <p className="rating">⭐ {game.rating}/5</p>
          <p className="genre">🎮 {game.genre}</p>
          <p><b>OS:</b> {game.os}</p>
          <p><b>Type:</b> {game.type}</p>
          <p className="desc">{game.description}</p>
          <p className="price">
            {game.price === 0 || game.price === "Free" ? "Free" : `₹${game.price}`}
          </p>
          <button className="play-btn">Play Now</button>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="requirements-box">
        {game.minimum && (
          <div className="requirements-column">
            <h3>🖥️ Minimum Requirements</h3>
            {Object.entries(game.minimum).map(([key, value]) => (
              <div key={key} className="req-item">
                <p className="req-label">{key}</p>
                <p className="req-value">{value}</p>
                <hr />
              </div>
            ))}
          </div>
        )}

        {game.Recommended && (
          <div className="requirements-column">
            <h3>⚡ Recommended Requirements</h3>
            {Object.entries(game.Recommended).map(([key, value]) => (
              <div key={key} className="req-item">
                <p className="req-label">{key}</p>
                <p className="req-value">{value}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameDetail;
