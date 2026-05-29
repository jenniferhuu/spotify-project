import express from "express";

const router = express.Router();

router.get("/likedsongs", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Access denied: issue with token" });
        }

        const token = authHeader.split(" ")[1];
        const limit = parseInt(req.query.limit, 10);
        const response = await fetch(
            `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                message: "Spotify API error",
                details: errorData,
            });
        }

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
