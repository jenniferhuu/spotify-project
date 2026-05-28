import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/useAuth.js";

function decodeUser(encodedUser) {
    const base64 = encodedUser.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
    );
    return JSON.parse(window.atob(paddedBase64));
}

function saveSpotifySession(user, token) {
    if (!token) return;

    window.localStorage.setItem("songs_app_user", JSON.stringify(user));
    window.localStorage.setItem("songs_app_token", token);

    // Compatibility keys used by TopSongs, TopArtists, and Profile pages.
    window.localStorage.setItem("spotifyToken", token);
    window.localStorage.setItem("accessToken", token);
    window.localStorage.setItem("access_token", token);

    // Compatibility user keys used by profile helpers.
    window.localStorage.setItem("spotifyUser", JSON.stringify(user));
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCallbackState(searchParams) {
    const spotifyError = searchParams.get("error");
    if (spotifyError) {
        return { error: spotifyError, shouldLogin: false };
    }

    const encodedUser = searchParams.get("user");
    const token = searchParams.get("token");

    if (!encodedUser || !token) {
        return {
            error: "Spotify did not return a valid login session.",
            shouldLogin: false,
        };
    }

    try {
        return {
            error: "",
            shouldLogin: true,
            user: decodeUser(encodedUser),
            token,
        };
    } catch (decodeError) {
        console.error(decodeError);
        return {
            error: "Could not read the Spotify profile.",
            shouldLogin: false,
        };
    }
}

export default function SpotifyCallBack() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeSpotifyLogin } = useAuth();
    const { error, shouldLogin, user, token } = useMemo(
        () => getCallbackState(searchParams),
        [searchParams],
    );

    useEffect(() => {
        if (!shouldLogin) {
            return;
        }

        completeSpotifyLogin(user, token);
        navigate("/", { replace: true });
    }, [completeSpotifyLogin, navigate, shouldLogin, token, user]);

    if (error) {
        return (
            <div className="login-page">
                <h1>Spotify login failed</h1>
                <p className="error-message">{error}</p>
                <Link className="back-link" to="/login">
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <div className="login-page">
            <h1>Finishing Spotify login...</h1>
            <p>Taking you back to the app.</p>
        </div>
    );
}
