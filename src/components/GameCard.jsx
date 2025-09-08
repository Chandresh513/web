import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GameCard.css";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className="game-card"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <img src={game.img || game.image} alt={game.title} />
      <div className="game-info">
        <h3>{game.title}</h3>
        <p>
          {game.price === 0 || game.price === "Free"
            ? "Free"
            : `₹${game.price}`}
        </p>
        <span>⭐ {game.rating}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/game/${game.id}`);
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
