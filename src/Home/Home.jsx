import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GameSlider from "../components/GameSlider";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import data from "../data.json"; // ✅ use local data.json
import "../styles/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const mostRated = [...data].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const freeGames = data.filter((g) => g.price === 0 || g.price === "Free");
  const expensiveGames = data
    .filter((g) => g.price !== 0 && g.price !== "Free")
    .sort((a, b) => b.price - a.price)
    .slice(0, 12);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 5,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section id="hero" className="hero-banner">
        <GameSlider games={mostRated} />
      </section>

      {/* Free Games */}
      <section id="free" className="section">
        <div className="section-header">
          <h2>🎁 Free Games</h2>
        </div>
        <Slider {...sliderSettings}>
          {freeGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.img} alt={game.title} className="game-img" />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p className="price">Free</p>
              <Link to={`/game/${encodeURIComponent(game.id)}`}>
                <button>Details</button>
              </Link>
            </div>
          ))}
        </Slider>
      </section>

      {/* Premium Games */}
      <section id="expensive" className="section">
        <div className="section-header">
          <h2>💎 Premium Games</h2>
        </div>
        <Slider {...sliderSettings}>
          {expensiveGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.img} alt={game.title} className="game-img" />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p className="price">₹{game.price}</p>
              <Link to={`/game/${encodeURIComponent(game.id)}`}>
                <button>Details</button>
              </Link>
            </div>
          ))}
        </Slider>
      </section>

      {/* About + Contact */}
      <div className="d-flex">
        <section id="about" className="section about">
          <h2>ℹ️ About Us</h2>
          <p>
            Welcome to <span className="highlight">GameHub</span> — your
            destination for free and premium games. We provide top-rated titles
            and fresh releases for every gamer.
          </p>
        </section>
        <section id="contact" className="section contact">
          <h2>📞 Contact Us</h2>
          <p>Email: support@gamehub.com</p>
          <p>Phone: +91-9876543210</p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
