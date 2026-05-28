import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SongRow from "../components/SongRow";

export default function LikedSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const response = await axios(
                    "http://localhost:5001/songs/likedsongs",
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
    }, []);

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

    if (loading) {
        return (
            <div className="p-8 text-slate-900 animate-pulse">
                Loading library...
            </div>
        );
    }

    return (
        <>
            <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
                <Navbar />
                <div className="flex-1 h-full p-8 overflow-y-auto">
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
                        {filteredSongs.length === 0 ? (
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
                            <ul className="flex flex-col gap-2">
                                {filteredSongs.map((song, index) => (
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
