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
            `https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${spotifyRange}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Spotify top songs error:", errorText);
            return res.status(response.status).json({
                message: "Failed to fetch top songs from Spotify",
            });
        }

        const data = await response.json();

        const songs = data.items.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            album: track.album?.name || "",
            image: track.album?.images?.[0]?.url || "",
            spotifyUrl: track.external_urls?.spotify || "",
        }));

        res.status(200).json({
            timeRange: requestedRange,
            total: songs.length,
            items: songs,
        });
    } catch (error) {
        console.error("Failed to fetch top songs", error);
        res.status(500).json({ message: "Failed to fetch top songs" });
    }
});

export default router;
