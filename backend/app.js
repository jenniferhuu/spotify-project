import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = process.send.PORT || 5000;
const host = process.env.HOST || "127.0.0.1";

import songsRouter from "./routes/songs.js";
import topSongsRouter from "./routes/topSongs.js";

app.use(cors());
app.use(express.json());

app.use("/songs", songsRouter);
app.use("/topSongs", topSongsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
