import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthProvider.jsx";

function decodeUser(encodedUser) {
    const base64 = encodedUser.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
    );
    return JSON.parse(window.atob(paddedBase64));
}

export default function SpotifyCallBack() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeSpotifyLogin } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const spotifyError = searchParams.get("error");
        const encodedUser = searchParams.get("user");
        const token = searchParams.get("token");

        if (spotifyError) {
            setError(spotifyError);
            return;
        }

        if (!encodedUser || !token) {
            setError("Spotify did not return a valid login session.");
            return;
        }

        try {
            completeSpotifyLogin(decodeUser(encodedUser), token);

            navigate("/", { replace: true });
        } catch (decodeError) {
            console.error(decodeError);
            setError("Could not read the Spotify profile.");
        }
    }, [completeSpotifyLogin, navigate, searchParams]);

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
