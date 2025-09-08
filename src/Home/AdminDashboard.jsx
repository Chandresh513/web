import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export default function AdminDashboard() {
  const [games, setGames] = useState([]);
  const [gameForm, setGameForm] = useState({
    id: "",
    title: "",
    img: "",
    rating: "",
    type: "",
    os: "",
    price: "",
    minimum: { Os: "", Processor: "", Memory: "", Storage: "", Graphics: "" },
    Recommended: { Os: "", Processor: "", Memory: "", Storage: "", Graphics: "" },
  });
  const [editGameId, setEditGameId] = useState(null);
  const navigate = useNavigate();

  // Fetch all games
  const fetchGames = async () => {
    try {
      const res = await api.get("/data");
      setGames(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Handle input changes
  const handleGameChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("minimum.")) {
      const field = name.split(".")[1];
      setGameForm({
        ...gameForm,
        minimum: { ...gameForm.minimum, [field]: value },
      });
    } else if (name.startsWith("Recommended.")) {
      const field = name.split(".")[1];
      setGameForm({
        ...gameForm,
        Recommended: { ...gameForm.Recommended, [field]: value },
      });
    } else {
      setGameForm({ ...gameForm, [name]: value });
    }
  };

  // Reset form
  const resetForm = () => {
    setGameForm({
      id: "",
      title: "",
      img: "",
      rating: "",
      type: "",
      os: "",
      price: "",
      minimum: { Os: "", Processor: "", Memory: "", Storage: "", Graphics: "" },
      Recommended: { Os: "", Processor: "", Memory: "", Storage: "", Graphics: "" },
    });
    setEditGameId(null);
  };

  // Add / Update game
  const handleGameSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...gameForm };

      if (editGameId) {
        delete payload.id; // don’t overwrite custom id
        await api.put(`/data/${editGameId}`, payload);
      } else {
        await api.post("/data", payload);
      }

      resetForm();
      fetchGames();
    } catch (err) {
      console.error("❌ Error saving game:", err);
    }
  };

  // Edit game
  const handleGameEdit = (g) => {
    setGameForm({
      id: g.id,
      title: g.title,
      img: g.img,
      rating: g.rating,
      type: g.type,
      os: g.os,
      price: g.price,
      minimum:
        g.minimum || {
          Os: "",
          Processor: "",
          Memory: "",
          Storage: "",
          Graphics: "",
        },
      Recommended:
        g.Recommended || {
          Os: "",
          Processor: "",
          Memory: "",
          Storage: "",
          Graphics: "",
        },
    });
    setEditGameId(g._id); // ✅ Mongo _id used for update
  };

  // Delete game
  const handleGameDelete = async (id) => {
    try {
      await api.delete(`/data/${id}`);
      fetchGames();
    } catch (err) {
      console.error("❌ Error deleting game:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>⚙️ Admin Dashboard</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <section>
        {/* Add / Edit Form */}
        <div className="card">
          <h2>{editGameId ? "Edit Game" : "Add Game"}</h2>
          <form onSubmit={handleGameSubmit}>
            {!editGameId && (
              <input
                type="text"
                name="id"
                value={gameForm.id}
                onChange={handleGameChange}
                placeholder="Game ID"
                required
              />
            )}
            <input
              type="text"
              name="title"
              value={gameForm.title}
              onChange={handleGameChange}
              placeholder="Title"
              required
            />
            <input
              type="text"
              name="img"
              value={gameForm.img}
              onChange={handleGameChange}
              placeholder="Image URL"
            />
            <input
              type="text"
              name="rating"
              value={gameForm.rating}
              onChange={handleGameChange}
              placeholder="Rating"
            />
            <input
              type="text"
              name="type"
              value={gameForm.type}
              onChange={handleGameChange}
              placeholder="Type"
            />
            <input
              type="text"
              name="os"
              value={gameForm.os}
              onChange={handleGameChange}
              placeholder="OS"
            />
            <input
              type="text"
              name="price"
              value={gameForm.price}
              onChange={handleGameChange}
              placeholder="Price"
            />

            {Object.keys(gameForm.minimum).map((field) => (
              <input
                key={field}
                type="text"
                name={`minimum.${field}`}
                value={gameForm.minimum[field]}
                onChange={handleGameChange}
                placeholder={`Minimum ${field}`}
              />
            ))}

            {Object.keys(gameForm.Recommended).map((field) => (
              <input
                key={field}
                type="text"
                name={`Recommended.${field}`}
                value={gameForm.Recommended[field]}
                onChange={handleGameChange}
                placeholder={`Recommended ${field}`}
              />
            ))}

            <button type="submit">
              {editGameId ? "Update Game" : "Add Game"}
            </button>
          </form>
        </div>

        {/* Games List */}
        <div className="card table-container">
          <h2>Games List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Image</th>
                <th>Rating</th>
                <th>Type</th>
                <th>OS</th>
                <th>Price</th>
                <th>Minimum</th>
                <th>Recommended</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g._id}>
                  <td>{g.id}</td>
                  <td>{g.title}</td>
                  <td>{g.img && <img src={g.img} alt={g.title} />}</td>
                  <td>{g.rating}</td>
                  <td>{g.type}</td>
                  <td>{g.os}</td>
                  <td>{g.price}</td>
                  <td>
                    {g.minimum &&
                      Object.entries(g.minimum).map(([k, v]) => (
                        <div key={k}>
                          <b>{k}:</b> {v}
                        </div>
                      ))}
                  </td>
                  <td>
                    {g.Recommended &&
                      Object.entries(g.Recommended).map(([k, v]) => (
                        <div key={k}>
                          <b>{k}:</b> {v}
                        </div>
                      ))}
                  </td>
                  <td>
                    <button
                      className="table-btn btn-edit"
                      onClick={() => handleGameEdit(g)}
                    >
                      Edit
                    </button>
                    <button
                      className="table-btn btn-delete"
                      onClick={() => handleGameDelete(g._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
