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
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        if (!token) return;

        const fetchLikedSongs = async () => {
            try {
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
                setSongs(response.data.items);
                console.log(response.data.items);
            } catch (error) {
                console.error("Failed to fetch liked songs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedSongs();
    }, [token]);

    const filteredSongs = songs.filter((song) => {
        const trackName = song.track?.name?.toLowerCase() || "";
        const artistNames =
            song.track?.artists
                ?.map((a) => a.name)
                .join(" ")
                .toLowerCase() || "";
        const albumName = song.track?.album?.name?.toLowerCase() || "";
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

    if (loading) {
        return (
            <div className="p-8 text-slate-900 animate-pulse">
                Loading library...
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50 overflow-x-hidden">
                <Navbar />
                <div className="ml-52 min-h-screen p-8">
                    <div className="mx-auto flex flex-col gap-2">
                        <h2 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">
                            Your Liked Songs
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-1 mb-3">
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Search by title, artist, or album..."
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                        {songsToDisplay.length === 0 ? (
                            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-sm mt-2">
                                <span className="text-3xl block mb-2">🔍</span>
                                <h3 className="text-sm font-medium text-slate-800 mb-1">
                                    No songs found
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Check the spelling, or try entering a
                                    different song title, artist, or album.
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-2">
                                    {songsToDisplay.map((song, index) => (
                                        <li
                                            key={song.track?.id || index}
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
        </>
    );
}
