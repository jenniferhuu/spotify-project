import cors from "cors";
import "dotenv/config";
import express from "express";
import forumsRouter from "./routes/forums.js"

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());
app.use("/api/forums", forumsRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
