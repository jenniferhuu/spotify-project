import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import Navbar from "../components/Navbar";
import SongRow from "../components/SongRow";

export default function LikedSongs() {
    const { token } = useAuth();

    const [songs, setSongs] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        if (!token) return;

        const fetchLikedSongs = async () => {
            setLoading(true);
            setError("");

            try {
                console.log("Liked songs token found:", Boolean(token));
                console.log(
                    "Liked songs token preview:",
                    token ? token.slice(0, 12) : "none",
                );
                const response = await axios.get(
                    "http://localhost:5000/songs/likedsongs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            limit: 50,
                        },
                    },
                );

                console.log("Liked songs response:", response.data);

                setSongs(response.data.items ?? []);
            } catch (error) {
                console.error("Failed to fetch liked songs", error);
                console.error("Failed request:", error.response?.data || error);
                console.error("Status:", error.response?.status);

                setError("Unable to load liked songs right now.");
                setSongs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedSongs();
    }, [token]);

    const filteredSongs = songs.filter((song) => {
        const track = song.track || song;

        const trackName =
            track.name?.toLowerCase() || song.title?.toLowerCase() || "";

        const artistNames =
            track.artists
                ?.map((a) => a.name)
                .join(" ")
                .toLowerCase() ||
            song.artist?.toLowerCase() ||
            "";

        const albumName =
            track.album?.name?.toLowerCase() || song.album?.toLowerCase() || "";

        const query = searchName.toLowerCase();

        return (
            trackName.includes(query) ||
            artistNames.includes(query) ||
            albumName.includes(query)
        );
    });

    const songsToDisplay = filteredSongs.slice(0, visibleCount);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    // if (loading) {
    //     return (
    //         <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
    //             <Navbar />
    //             <div className="flex-1 p-8 text-slate-900 animate-pulse">
    //                 Loading library...
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
            <Navbar />

            <div className="ml-52 flex-1 h-full px-6 py-10 overflow-y-auto">
                <div className="mx-auto flex flex-col gap-2">
                    <section className="space-y-3 mb-5">
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Your Liked Songs
                        </h1>
                        <p className="text-base text-slate-600 sm:text-lg">
                            Songs you&apos;ve added recently
                        </p>
                    </section>

                    <div className="flex flex-col sm:flex-row gap-1 mb-3">
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Search by title, artist, or album..."
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                    {loading ? (
                        <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-slate-500">
                            Loading liked songs...
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center bg-rose-50 border border-rose-200 rounded-xl shadow-sm mt-2">
                            <span className="text-3xl block mb-2">⚠️</span>
                            <h3 className="text-sm font-medium text-rose-800 mb-1">
                                {error}
                            </h3>
                            <p className="text-xs text-rose-500">
                                Try logging out and logging back in with
                                Spotify.
                            </p>
                        </div>
                    ) : songsToDisplay.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm mt-2">
                            <span className="text-3xl block mb-2">🔍</span>
                            <h3 className="text-sm font-medium text-slate-800 mb-1">
                                No songs found
                            </h3>
                            <p className="text-xs text-slate-500">
                                Check the spelling, or try entering a different
                                song title, artist, or album.
                            </p>
                        </div>
                    ) : (
                        <>
                            <ul className="flex flex-col gap-2">
                                {songsToDisplay.map((song, index) => (
                                    <li
                                        key={song.track?.id || song.id || index}
                                        className="list-none"
                                    >
                                        <SongRow
                                            songData={song}
                                            index={index + 1}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {filteredSongs.length > visibleCount && (
                                <button
                                    onClick={handleShowMore}
                                    className="mt-4 mx-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-full transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Show More
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
