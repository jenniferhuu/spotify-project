import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = process.send.PORT || 5000;
const host = process.env.HOST || "127.0.0.1";

import songsRouter from "./routes/songs.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/songs", songsRouter);
app.use("/users", usersRouter);

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
