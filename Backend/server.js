const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 5000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== MongoDB Atlas Connection =====
mongoose
  .connect(
    "mongodb+srv://admin:admin@web.jqrwq42.mongodb.net/gamehub?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== User Schema & Model =====
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema, "users");

// ===== Game Schema & Model =====
const gameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  img: String,
  rating: Number,
  genre: String,
  description: String,
  os: String,
  type: String,
  price: mongoose.Schema.Types.Mixed,
  minimum: Object,
  Recommended: Object,
});
const Game = mongoose.model("Data", gameSchema, "data");

// ===== Paths for data.json =====
const backendDataFile = path.join(__dirname, "data.json");
const frontendDataFile = path.join(__dirname, "../src/data.json"); // ✅ adjust path if needed

// ===== Helper: Save DB → JSON (backend + frontend) =====
async function saveGamesToFile() {
  try {
    const games = await Game.find();
    const jsonData = JSON.stringify(games, null, 2);

    // Save backend copy
    await fs.writeFile(backendDataFile, jsonData, "utf-8");

    // Save frontend copy
    await fs.writeFile(frontendDataFile, jsonData, "utf-8");

    console.log("✅ data.json updated in backend & frontend with", games.length, "games");
  } catch (err) {
    console.error("❌ Error writing data.json:", err.message);
  }
}

// ===== Startup Sync (DB <-> JSON) =====
async function syncDatabase() {
  try {
    const dbGames = await Game.find();

    if (dbGames.length > 0) {
      console.log("📥 MongoDB has data → syncing to data.json...");
      await saveGamesToFile();
    } else {
      console.log("📂 MongoDB empty → checking data.json...");
      try {
        const jsonData = await fs.readFile(backendDataFile, "utf-8");
        const gamesFromFile = JSON.parse(jsonData);

        if (gamesFromFile.length > 0) {
          await Game.insertMany(gamesFromFile);
          console.log("✅ MongoDB seeded from data.json");
        }
      } catch {
        console.log("⚠️ No valid data.json found to seed DB.");
      }
    }
  } catch (err) {
    console.error("❌ Error during startup sync:", err.message);
  }
}

// ===== Root Route =====
app.get("/", (req, res) => res.send("✅ API is running..."));

// ================= USERS =================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already exists" });

    await new User({ name, email, password }).save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ================= GAMES (CRUD) =================

// Get all games
app.get("/data", async (_, res) => {
  try {
    res.json(await Game.find());
  } catch {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Get single game
app.get("/data/:ref", async (req, res) => {
  try {
    const ref = decodeURIComponent(req.params.ref);
    let game = null;

    if (mongoose.Types.ObjectId.isValid(ref)) game = await Game.findById(ref);
    if (!game) game = await Game.findOne({ id: ref });
    if (!game) game = await Game.findOne({ title: new RegExp(`^${ref}$`, "i") });

    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
  } catch (err) {
    console.error("Error fetching game:", err);
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// Add game
app.post("/data", async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    console.log("🆕 Game added:", game.title);
    await saveGamesToFile();
    res.json(game);
  } catch (err) {
    console.error("Error adding game:", err.message);
    res.status(500).json({ error: "Failed to add game" });
  }
});

// Update game
app.put("/data/:ref", async (req, res) => {
  try {
    const ref = req.params.ref;
    let updated = null;

    if (mongoose.Types.ObjectId.isValid(ref))
      updated = await Game.findByIdAndUpdate(ref, req.body, { new: true });
    if (!updated)
      updated = await Game.findOneAndUpdate({ id: ref }, req.body, { new: true });

    if (!updated) return res.status(404).json({ error: "Game not found" });

    console.log("✏️ Game updated:", updated.title);
    await saveGamesToFile();
    res.json(updated);
  } catch (err) {
    console.error("Error updating game:", err.message);
    res.status(500).json({ error: "Failed to update game" });
  }
});

// Delete game
app.delete("/data/:ref", async (req, res) => {
  try {
    const ref = req.params.ref;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(ref))
      deleted = await Game.findByIdAndDelete(ref);
    if (!deleted) deleted = await Game.findOneAndDelete({ id: ref });

    if (!deleted) return res.status(404).json({ error: "Game not found" });

    console.log("🗑️ Game deleted:", deleted.title);
    await saveGamesToFile();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting game:", err.message);
    res.status(500).json({ error: "Failed to delete game" });
  }
});

// ===== Start Server =====
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await syncDatabase();
});
