import express from "express";

const router = express.Router();
const spotifyApiUrl = "https://api.spotify.com/v1";

const spotifyTimeRanges = {
	allTime: "long_term",
	lastYear: "medium_term",
	lastMonth: "short_term",
};

// Helper function to extract the Bearer token from the Authorization header from frontend request
function getBearerToken(req) {
	const authorizationHeader = req.headers.authorization || "";
	if (!authorizationHeader.startsWith("Bearer ")) {
		return "";
	}

	return authorizationHeader.slice(7).trim();
}

async function getSpotifyErrorMessage(response, fallbackMessage) {
	const responseText = await response.text();

	if (!responseText) {
		return fallbackMessage;
	}

	try {
		const responseBody = JSON.parse(responseText);
		return (
			responseBody.error_description ||
			responseBody.error?.message ||
			responseBody.error ||
			fallbackMessage
		);
	} catch {
		return responseText;
	}
}

// Helper function to format Spotify track data into a consistent structure for frontend
function formatTopTrack(track, index) {
	return {
		rank: index + 1,
		id: track.id,
		title: track.name,
		artist: track.artists?.map((artist) => artist.name).join(", ") || "",
		album: track.album?.name || "",
		imageUrl: track.album?.images?.[0]?.url || "",
		spotifyUrl: track.external_urls?.spotify || "",
	};
}

// The actual request to Spotify API
router.get("/", async (req, res) => {
	try {
		const accessToken = getBearerToken(req);
		if (!accessToken) {
			return res.status(401).json({
				message: "Missing Spotify access token",
			});
		}

		const requestedRange = req.query.range || "allTime";
		const timeRange = spotifyTimeRanges[requestedRange] || "long_term";
		const response = await fetch(
			`${spotifyApiUrl}/me/top/tracks?time_range=${timeRange}&limit=30`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

        // If Spotify API returns an error, extract the error message and send it back to frontend
		if (!response.ok) {
			const errorMessage = await getSpotifyErrorMessage(
				response,
				"Failed to fetch top songs",
			);

			return res.status(response.status).json({
				message: "Spotify API error",
				details: errorMessage,
			});
		}

		const data = await response.json();
		const songs = (data.items || []).map(formatTopTrack);

		res.status(200).json({
			timeRange: requestedRange,
			total: data.total ?? songs.length,
			items: songs,
		});
	} catch (error) {
		console.error("Failed to fetch top songs", error);
		res.status(500).json({ message: "Failed to fetch top songs" });
	}
});

export default router;
