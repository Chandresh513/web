import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import games from "../data.json"; // ✅ Load games from JSON
import "../styles/Store.css";

export default function Store() {
  const [search, setSearch] = useState("");
  const [filteredGames, setFilteredGames] = useState(games);
  const navigate = useNavigate();

  // ✅ Filter games by title
  useEffect(() => {
    setFilteredGames(
      games.filter((game) =>
        game.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  // ✅ Inline GameCard component
  const GameCard = ({ game }) => (
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

  return (
    <div className="store-container">
      {/* Go Back */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <h1 className="store-title">🎮 Game Store</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Game Grid */}
      <div className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p className="no-results">No games found!</p>
        )}
      </div>

      {/* Scroll to Top Button */}
      <button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆ Top
      </button>
    </div>
  );
}
