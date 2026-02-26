import express from "express";
import cors from "cors";
import moviesData from "./data/movies";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running. Try /api/movies");
});

app.get("/api/movies", (req, res) => {
  res.json(moviesData);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
