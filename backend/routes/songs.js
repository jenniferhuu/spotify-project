import express from "express";

const router = express.Router();

router.get("/likedsongs", async (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Missing Spotify token" });
        }

        const response = await fetch(
            "https://api.spotify.com/v1/me/tracks?limit=20",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Spotify liked songs error:", errorText);

            return res.status(response.status).json({
                message: "Failed to fetch liked songs from Spotify",
            });
        }

        const data = await response.json();

        res.status(200).json({
            total: data.total,
            items: data.items,
        });
    } catch (error) {
        console.error("Failed to fetch liked songs", error);
        res.status(500).json({ message: "Failed to fetch liked songs" });
    }
});

export default router;
