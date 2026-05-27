import cors from "cors";
import "dotenv/config";
import express from "express";
import forumsRouter from "./routes/forums.js";
import songsRouter from "./routes/songs.js";
import authRouter from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/forums", forumsRouter);
app.use("/songs", songsRouter);

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
