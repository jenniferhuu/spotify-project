import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SongRow from "../components/SongRow";

export default function LikedSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const response = await axios(
                    "http://localhost:5000/songs/likedsongs",
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
                        {songs.map((song, index) => (
                            <SongRow
                                key={song.track?.id || index}
                                songData={song}
                                index={index + 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
