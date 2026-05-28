import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 5001;
const host = process.env.HOST || "127.0.0.1";

import songsRouter from "./routes/songs.js";
import topSongsRouter from "./routes/topSongs.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import topArtistsRouter from "./routes/topArtists.js";

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/songs", songsRouter);
app.use("/topSongs", topSongsRouter);
app.use("/users", usersRouter);
app.use("/topArtists", topArtistsRouter);

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
