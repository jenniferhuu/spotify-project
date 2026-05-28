import { Router } from "express";
import { listPublicUsers, findUserBySpotifyId, updateUser } from "../db/userService.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await listPublicUsers();
        res.json({ users });
    } catch (err) {
        console.error("Error listing users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:spotifyId", async (req, res) => {
    try {
        const user = await findUserBySpotifyId(req.params.spotifyId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ spotifyId: user.spotifyId, isPrivate: user.isPrivate });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch("/privacy", async (req, res) => {
    try {
        const { spotifyId, isPrivate } = req.body;

        if (!spotifyId) {
            return res.status(400).json({ error: "spotifyId is required" });
        }

        if (typeof isPrivate !== "boolean") {
            return res.status(400).json({ error: "isPrivate must be a boolean" });
        }

        const user = await findUserBySpotifyId(spotifyId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await updateUser(user.id, { isPrivate });

        res.json({ spotifyId, isPrivate });
    } catch (err) {
        console.error("Error updating user privacy:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
