import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import games from "../data.json"; // ✅ local data.json
import "../styles/GameSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function GameSlider() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="game-slider">
      <Slider {...settings}>
        {games.slice(0, 5).map((game) => (
          <div key={game.id} className="slider-item">
            <div className="slider-content">
              <div className="slider-img">
                <img src={game.img} alt={game.title} />
              </div>
              <div className="slider-info">
                <h2>{game.title}</h2>
                <p className="genre">{game.genre}</p>
                <p className="desc">{game.description}</p>
                <p className="price">
                  {game.price === 0 || game.price === "Free"
                    ? "Free"
                    : `₹${game.price}`}
                </p>
                <div className="rating">⭐ {game.rating}/5</div>
                <Link to={`/game/${game.id}`}>
                  <button className="details-btn">Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default GameSlider;
