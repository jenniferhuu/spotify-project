import express from "express";

const router = express.Router();

const topArtistsByRange = {
    allTime: [
        {
            rank: 1,
            name: "All Time Artist 1",
            genre: "Pop",
            image: "",
        },
        {
            rank: 2,
            name: "All Time Artist 2",
            genre: "Indie",
            image: "",
        },
        {
            rank: 3,
            name: "All Time Artist 3",
            genre: "R&B",
            image: "",
        },
        {
            rank: 4,
            name: "All Time Artist 4",
            genre: "Rock",
            image: "",
        },
    ],
    lastYear: [
        {
            rank: 1,
            name: "Last Year Artist 1",
            genre: "Pop",
            image: "",
        },
        {
            rank: 2,
            name: "Last Year Artist 2",
            genre: "Indie",
            image: "",
        },
        {
            rank: 3,
            name: "Last Year Artist 3",
            genre: "R&B",
            image: "",
        },
        {
            rank: 4,
            name: "Last Year Artist 4",
            genre: "Rock",
            image: "",
        },
    ],
    lastMonth: [
        {
            rank: 1,
            name: "Last Month Artist 1",
            genre: "Pop",
            image: "",
        },
        {
            rank: 2,
            name: "Last Month Artist 2",
            genre: "Indie",
            image: "",
        },
        {
            rank: 3,
            name: "Last Month Artist 3",
            genre: "R&B",
            image: "",
        },
        {
            rank: 4,
            name: "Last Month Artist 4",
            genre: "Rock",
            image: "",
        },
    ],
};

router.get("/", async (req, res) => {
    try {
        const requestedRange = req.query.range || "allTime";
        const artists =
            topArtistsByRange[requestedRange] || topArtistsByRange.allTime;

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