import express from "express";
import crypto from "node:crypto";

import {
    validateUser,
    findUserBySpotifyId,
    createUser,
    updateUser,
} from "../db/userService.js";

const router = express.Router();
const spotifyAccountsUrl = "https://accounts.spotify.com";
const spotifyApiUrl = "https://api.spotify.com/v1";
const frontendUrl = process.env.FRONTEND_URL || "http://127.0.0.1:5173";
const spotifyScopes = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-top-read",
];

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// Switch localhost URLs to 127.0.0.1 because Spotify does not accept
// localhost as a valid redirect URI hostname
function normalizeLoopbackUrl(value, fallback) {
    const nextValue = value || fallback;

    try {
        const url = new URL(nextValue);
        if (url.hostname === "localhost") {
            url.hostname = "127.0.0.1";
        }
        return url.toString();
    } catch {
        return fallback;
    }
}

const SPOTIFY_REDIRECT_URI = normalizeLoopbackUrl(
    process.env.SPOTIFY_REDIRECT_URI,
    "http://127.0.0.1:5000/auth/spotify/callback",
);

function getCookie(req, name) {
    const header = req.headers.cookie;

    if (!header) {
        return "";
    }

    const cookies = Object.fromEntries(
        header.split(";").map((cookie) => {
            const [name, ...valueParts] = cookie.trim().split("=");
            try {
                return [name, decodeURIComponent(valueParts.join("="))];
            } catch {
                return [name, valueParts.join("=")];
            }
        }),
    );
    return cookies[name] || "";
}

function buildFrontendRedirect(path, params = {}) {
    const redirectUrl = new URL(path, frontendUrl);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            redirectUrl.searchParams.set(key, value);
        }
    });
    return redirectUrl.toString();
}

function encodeUser(user) {
    return Buffer.from(JSON.stringify(user)).toString("base64url");
}

function buildSpotifyUser(profile) {
    return {
        spotifyId: profile.id,
        username: profile.display_name || profile.id,
        profilePic: profile.images?.[0]?.url || "",
    };
}

async function getSpotifyErroMessage(response, fallbackMessage) {
    const responseText = await response.text();

    if (!responseText) return fallbackMessage;

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

router.get("/spotify", (req, res) => {
    const state = crypto.randomBytes(16).toString("hex");
    const authorizeUrl = new URL("/authorize", spotifyAccountsUrl);
    authorizeUrl.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("redirect_uri", SPOTIFY_REDIRECT_URI);
    authorizeUrl.searchParams.set("scope", spotifyScopes.join(" "));
    authorizeUrl.searchParams.set("state", state);

    res.cookie("spotify_auth_state", state, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: "lax",
    });
    return res.redirect(authorizeUrl.toString());
});

router.get("/spotify/callback", async (req, res) => {
    const { code, state, error } = req.query;
    if (error) {
        return res.redirect(
            buildFrontendRedirect("/spotify/callback", { error }),
        );
    }

    const savedState = getCookie(req, "spotify_auth_state");
    if (!code || !state || savedState !== state) {
        return res.redirect(
            buildFrontendRedirect("/spotify/callback", {
                error: "Invalid Spotify login attempt",
            }),
        );
    }

    res.clearCookie("spotify_auth_state");

    try {
        const tokenResponse = await fetch(`${spotifyAccountsUrl}/api/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                grant_type: "authorization_code",
                redirect_uri: SPOTIFY_REDIRECT_URI,
            }),
        });
        if (!tokenResponse.ok) throw new Error("Token exchange failed");
        const tokenData = await tokenResponse.json();

        const profileResponse = await fetch(`${spotifyApiUrl}/me`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profile = await profileResponse.json();

        // Fetch top artist to get genre
        let topGenre = "";
        try {
            const topArtistsRes = await fetch(`${spotifyApiUrl}/me/top/artists?limit=1`, {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (topArtistsRes.ok) {
                const topArtists = await topArtistsRes.json();
                topGenre = topArtists.items?.[0]?.genres?.[0] || "";
            }
        } catch {
            // Non-critical, just leave topGenre empty
        }

        const spotifyUserObject = buildSpotifyUser(profile);

        let inDatabase = await findUserBySpotifyId(spotifyUserObject.spotifyId);

        if (!inDatabase) {
            await createUser({
                spotifyId: spotifyUserObject.spotifyId,
                username: spotifyUserObject.username,
                profilePic: spotifyUserObject.profilePic,
                topGenre,
                isPrivate: true,
                pinnedArtists: [],
                pinnedTracks: [],
            });
        } else {
            await updateUser(inDatabase.id, {
                profilePic: spotifyUserObject.profilePic,
                topGenre,
            });
        }

        return res.redirect(
            buildFrontendRedirect("/spotify/callback", {
                user: encodeUser(spotifyUserObject),
                token: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
            }),
        );
    } catch (error) {
        console.error("Failed to authorize user with Spotify: ", error);
        return res.redirect(
            buildFrontendRedirect("/spotify/callback", {
                error: error.message,
            }),
        );
    }
});

export default router;
