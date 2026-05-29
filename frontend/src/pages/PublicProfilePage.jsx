import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_URL = "http://127.0.0.1:5000";

const rangeLabels = {
    allTime: "All Time",
    lastYear: "Last Year",
    lastMonth: "Last Month",
};

export default function PublicProfilePage() {
    const { spotifyId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/users/${spotifyId}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then((data) => {
                if (data.isPrivate) {
                    setError("This profile is private.");
                } else {
                    setUser(data);
                }
            })
            .catch(() => setError("User not found."))
            .finally(() => setLoading(false));
    }, [spotifyId]);

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-slate-50">
                <Navbar />
                <main className="ml-52 flex-1 flex items-center justify-center">
                    <p className="text-slate-500">Loading profile...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-full h-screen bg-slate-50">
                <Navbar />
                <main className="ml-52 flex-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-slate-500 text-lg">{error}</p>
                    <Link
                        to="/discover"
                        className="text-[#1F6F5F] hover:underline text-sm"
                    >
                        Back to Discover
                    </Link>
                </main>
            </div>
        );
    }

    const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "User";
    const handle = user.handle || user.spotifyId;

    return (
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
            <Navbar />

            <main className="ml-52 flex-1 overflow-y-auto px-8 py-8 text-black">
                <div className="mx-auto max-w-2xl">
                    <Link
                        to="/discover"
                        className="inline-flex items-center gap-1 text-sm text-[#1F6F5F] hover:underline mb-6"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Discover
                    </Link>

                    <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
                        <div className="h-28 bg-[#176b5a]" />

                        <div className="-mt-11 ml-7">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={displayName}
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover bg-[#d9d9d9]"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#d9d9d9] text-4xl text-white">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="px-7 pb-5 pt-2">
                            <h1 className="text-lg font-bold">{displayName}</h1>
                            <p className="text-sm text-gray-600">@{handle}</p>
                            {user.bio && (
                                <p className="mt-2 text-sm">{user.bio}</p>
                            )}
                            {user.topGenre && (
                                <span className="mt-2 inline-block rounded-full bg-[#dceee2] px-3 py-1 text-xs text-[#176b5a] font-medium">
                                    {user.topGenre}
                                </span>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/inbox?startChat=${user.spotifyId}`,
                                        )
                                    }
                                    className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#1F6F5F] text-[#1F6F5F] text-sm font-medium hover:bg-[#1F6F5F] hover:text-white transition-colors duration-150 cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    Message
                                </button>
                            </div>
                        </div>

                        {user.showTopArtists &&
                            user.topArtistsCache?.length > 0 && (
                                <section className="border-t border-gray-200 px-7 py-5">
                                    <h3 className="text-lg font-bold mb-4">
                                        Top Artists (
                                        {rangeLabels[user.artistRange] ||
                                            "All Time"}
                                        )
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {user.topArtistsCache.map(
                                            (artist, i) => (
                                                <div
                                                    key={i}
                                                    className="text-center"
                                                >
                                                    {artist.imageUrl ? (
                                                        <img
                                                            src={
                                                                artist.imageUrl
                                                            }
                                                            alt={artist.name}
                                                            className="mx-auto h-16 w-16 rounded-full object-cover bg-[#dceee2]"
                                                        />
                                                    ) : (
                                                        <div className="mx-auto h-16 w-16 rounded-full bg-[#dceee2]" />
                                                    )}
                                                    <p className="mt-2 truncate text-xs text-gray-600">
                                                        {artist.name}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}

                        {user.showTopSongs &&
                            user.topSongsCache?.length > 0 && (
                                <section className="border-t border-gray-200 px-7 py-5">
                                    <h3 className="text-lg font-bold mb-4">
                                        Top Songs (
                                        {rangeLabels[user.songRange] ||
                                            "All Time"}
                                        )
                                    </h3>
                                    <div className="space-y-4">
                                        {user.topSongsCache.map((song, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-4"
                                            >
                                                {song.imageUrl ? (
                                                    <img
                                                        src={song.imageUrl}
                                                        alt={song.title}
                                                        className="h-14 w-14 rounded-md object-cover bg-[#d9d9d9]"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 rounded-md bg-[#d9d9d9]" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {song.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {song.artist}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                        {user.showLikedSongs &&
                            user.likedSongsCache?.length > 0 && (
                                <section className="border-t border-gray-200 px-7 py-5">
                                    <h3 className="text-lg font-bold mb-4">
                                        Recently Liked
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {user.likedSongsCache.map(
                                            (song, i) => (
                                                <div key={i}>
                                                    {song.imageUrl ? (
                                                        <img
                                                            src={song.imageUrl}
                                                            alt={song.name}
                                                            className="aspect-square rounded-md object-cover bg-[#d9d9d9]"
                                                        />
                                                    ) : (
                                                        <div className="aspect-square rounded-md bg-[#d9d9d9]" />
                                                    )}
                                                    <p className="mt-2 truncate text-xs text-gray-600">
                                                        {song.name}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}
                    </div>
                </div>
            </main>
        </div>
    );
}
