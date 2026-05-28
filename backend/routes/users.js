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
        if (user.isPrivate) {
            return res.json({ spotifyId: user.spotifyId, isPrivate: true });
        }
        res.json({
            id: user.id,
            spotifyId: user.spotifyId,
            isPrivate: user.isPrivate,
            username: user.username,
            profilePic: user.profilePic,
            topGenre: user.topGenre,
            bio: user.bio || "",
            handle: user.handle || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            showTopArtists: user.showTopArtists ?? false,
            showTopSongs: user.showTopSongs ?? false,
            showLikedSongs: user.showLikedSongs ?? false,
            artistRange: user.artistRange || "allTime",
            songRange: user.songRange || "allTime",
            topArtistsCache: user.topArtistsCache || [],
            topSongsCache: user.topSongsCache || [],
            likedSongsCache: user.likedSongsCache || [],
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch("/profile", async (req, res) => {
    try {
        const { spotifyId, ...fields } = req.body;

        if (!spotifyId) {
            return res.status(400).json({ error: "spotifyId is required" });
        }

        const user = await findUserBySpotifyId(spotifyId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const allowed = [
            "bio", "handle", "firstName", "lastName",
            "showTopArtists", "showTopSongs", "showLikedSongs",
            "artistRange", "songRange",
            "topArtistsCache", "topSongsCache", "likedSongsCache",
        ];
        const update = {};
        for (const key of allowed) {
            if (key in fields) {
                update[key] = fields[key];
            }
        }

        await updateUser(user.id, update);
        res.json({ spotifyId, ...update });
    } catch (err) {
        console.error("Error updating user profile:", err);
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
