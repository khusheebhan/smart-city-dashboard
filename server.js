// server.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// <-- Replace <YOUR_PASSWORD> with your MongoDB Atlas password
mongoose.connect("mongodb+srv://khushibhan05_db_user:khushi123@cluster0.6vkud5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// ---------------- Schemas ----------------
const trafficSchema = new mongoose.Schema({
  location: String,
  vehicles: Number,
  avgSpeed: Number,
  timestamp: { type: Date, default: Date.now }
});

const pollutionSchema = new mongoose.Schema({
  area: String,
  AQI: Number,
  mainPollutant: String,
  timestamp: { type: Date, default: Date.now }
});

const wasteSchema = new mongoose.Schema({
  zone: String,
  tonsCollected: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

// ---------------- Models ----------------
const Traffic = mongoose.model("Traffic", trafficSchema);
const Pollution = mongoose.model("Pollution", pollutionSchema);
const Waste = mongoose.model("Waste", wasteSchema);

// ---------------- Routes ----------------
app.get("/", async (req, res) => {
  const traffic = await Traffic.find().sort({ timestamp: -1 });
  const pollution = await Pollution.find().sort({ timestamp: -1 });
  const waste = await Waste.find().sort({ timestamp: -1 });
  res.render("dashboard", { traffic, pollution, waste });
});

// ---------------- POST Routes ----------------
app.post("/add-traffic", async (req, res) => {
  const { location, vehicles, avgSpeed } = req.body;
  await Traffic.create({ location, vehicles, avgSpeed });
  res.redirect("/");
});

app.post("/add-pollution", async (req, res) => {
  const { area, AQI, mainPollutant } = req.body;
  await Pollution.create({ area, AQI, mainPollutant });
  res.redirect("/");
});

app.post("/add-waste", async (req, res) => {
  const { zone, tonsCollected, status } = req.body;
  await Waste.create({ zone, tonsCollected, status });
  res.redirect("/");
});

// ---------------- Delete Routes ----------------
app.post("/delete-traffic", async (req, res) => {
  const { id } = req.body;
  await Traffic.findByIdAndDelete(id);
  res.redirect("/");
});

app.post("/delete-pollution", async (req, res) => {
  const { id } = req.body;
  await Pollution.findByIdAndDelete(id);
  res.redirect("/");
});

app.post("/delete-waste", async (req, res) => {
  const { id } = req.body;
  await Waste.findByIdAndDelete(id);
  res.redirect("/");
});

// ---------------- Sample Data Route ----------------
app.get("/add-sample-data", async (req, res) => {
  const trafficData = [
    { location: "Sector 18", vehicles: 230, avgSpeed: 28 },
    { location: "Sector 22", vehicles: 420, avgSpeed: 32 },
    { location: "Sector 30", vehicles: 500, avgSpeed: 35 },
    { location: "Sector 45", vehicles: 180, avgSpeed: 25 },
    { location: "Sector 50", vehicles: 320, avgSpeed: 30 }
  ];
  await Traffic.insertMany(trafficData);

  const pollutionData = [
    { area: "Sector 62", AQI: 122, mainPollutant: "PM2.5" },
    { area: "Sector 45", AQI: 98, mainPollutant: "NO2" },
    { area: "Sector 30", AQI: 110, mainPollutant: "SO2" },
    { area: "Sector 22", AQI: 75, mainPollutant: "CO" },
    { area: "Sector 18", AQI: 90, mainPollutant: "PM10" }
  ];
  await Pollution.insertMany(pollutionData);

  const wasteData = [
    { zone: "Zone A", tonsCollected: 5, status: "Collected" },
    { zone: "Zone B", tonsCollected: 7, status: "Pending" },
    { zone: "Zone C", tonsCollected: 6, status: "Collected" },
    { zone: "Zone D", tonsCollected: 8, status: "Pending" },
    { zone: "Zone E", tonsCollected: 4, status: "Collected" }
  ];
  await Waste.insertMany(wasteData);

  res.send("✅ Sample data added!");
});

// ---------------- Start Server ----------------
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
