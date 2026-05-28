import express from "express";

const router = express.Router();

const spotifyRangeMap = {
    allTime: "long_term",
    lastYear: "medium_term",
    lastMonth: "short_term",
};

router.get("/", async (req, res) => {
    try {
        const requestedRange = req.query.range || "allTime";
        const spotifyRange = spotifyRangeMap[requestedRange] || "long_term";

        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Missing Spotify token" });
        }

        const response = await fetch(
            `https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${spotifyRange}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Spotify top artists error:", errorText);

            return res.status(response.status).json({
                message: "Failed to fetch top artists from Spotify",
            });
        }

        const data = await response.json();

        const artists = data.items.map((artist, index) => ({
            id: artist.id,
            rank: index + 1,
            name: artist.name,
            genre: artist.genres?.[0] || "Unknown genre",
            image: artist.images?.[0]?.url || "",
            spotifyUrl: artist.external_urls?.spotify || "",
        }));

        res.status(200).json({
            timeRange: requestedRange,
            total: artists.length,
            items: artists,
        });
    } catch (error) {
        console.error("Failed to fetch top artists", error);
        res.status(500).json({ message: "Failed to fetch top artists" });
    }
});

export default router;