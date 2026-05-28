import express from "express";

const router = express.Router();

const topSongsByRange = {
	allTime: [
		{
			rank: 1,
			title: "All Time Song 1",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 2,
			title: "All Time Song 2",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 3,
			title: "All Time Song 3",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 4,
			title: "All Time Song 4",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 5,
			title: "All Time Song 5",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 6,
			title: "All Time Song 6",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 7,
			title: "All Time Song 7",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 8,
			title: "All Time Song 8",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 9,
			title: "All Time Song 9",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 10,
			title: "All Time Song 10",
			artist: "Artist Name",
			album: "Album Name",
		},
	],
	lastYear: [
		{
			rank: 1,
			title: "Last Year Song 1",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 2,
			title: "Last Year Song 2",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 3,
			title: "Last Year Song 3",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 4,
			title: "Last Year Song 4",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 5,
			title: "Last Year Song 5",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 6,
			title: "Last Year Song 6",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 7,
			title: "Last Year Song 7",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 8,
			title: "Last Year Song 8",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 9,
			title: "Last Year Song 9",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 10,
			title: "Last Year Song 10",
			artist: "Artist Name",
			album: "Album Name",
		},
	],
	lastMonth: [
		{
			rank: 1,
			title: "Last Month Song 1",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 2,
			title: "Last Month Song 2",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 3,
			title: "Last Month Song 3",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 4,
			title: "Last Month Song 4",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 5,
			title: "Last Month Song 5",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 6,
			title: "Last Month Song 6",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 7,
			title: "Last Month Song 7",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 8,
			title: "Last Month Song 8",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 9,
			title: "Last Month Song 9",
			artist: "Artist Name",
			album: "Album Name",
		},
		{
			rank: 10,
			title: "Last Month Song 10",
			artist: "Artist Name",
			album: "Album Name",
		},
	],
};

// Get top songs based on the time range, returns a JSON response with the requested songs
router.get("/", async (req, res) => {
	try {
		const requestedRange = req.query.range || "allTime";
		const songs = topSongsByRange[requestedRange] || topSongsByRange.allTime;

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
