import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import Navbar from "../components/Navbar";
import SongRow from "../components/SongRow.jsx";

export default function Home() {
    const { user, token } = useAuth();

    const [songs, setSongs] = useState([]);

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
                            limit: 3,
                        },
                    },
                );
                setSongs(response.data.items);
                console.log(response.data.items);
            } catch (error) {
                console.error("Failed to fetch liked songs", error);
            }
        };

        fetchLikedSongs();
    }, [token]);

    return (
        <>
            <div className="flex w-full h-screen bg-slate-50 mb-8 overflow-hidden">
                <Navbar />
                <div className="flex-1 h-full p-8 overflow-y-auto">
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">
                        Welcome back,{" "}
                        <span className="text-[#1F6F5F]">
                            {user?.username}
                        </span>{" "}
                    </h1>
                    <h3 className="text-md italic text-black tracking-tight">
                        Connect with music lovers and talk about your favorite
                        tracks!
                    </h3>
                    <div className="mt-12">
                        <section className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link
                                    to="/likedsongs"
                                    className="group flex flex-col min-h-[260px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Liked Songs
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            View All →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        Your recently saved tracks
                                    </div>
                                    <div className="flex-1 w-full min-w-0">
                                        {songs.length === 0 ? (
                                            <div className="h-full flex items-center justify-center border border-dashed border-white/20 rounded-xl p-4">
                                                <span className="text-xs text-white/60">
                                                    No tracks loaded
                                                </span>
                                            </div>
                                        ) : (
                                            <ul className="flex flex-col gap-2 w-full min-w-0">
                                                {songs.map((song, index) => (
                                                    <li
                                                        key={
                                                            song.track?.id ||
                                                            index
                                                        }
                                                        className="list-none w-full min-w-0 text-slate-900"
                                                    >
                                                        <SongRow
                                                            songData={song}
                                                            index={index + 1}
                                                            compact={true}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </Link>

                                <Link
                                    to="/topartists"
                                    className="group flex flex-col min-h-[180px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Top Artists
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            View All →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        PLACEHOLDER
                                    </div>
                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4">
                                        <span className="text-xs text-slate-200">
                                            No artists loaded
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/topsongs"
                                    className="group flex flex-col min-h-[180px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Top Songs
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            View All →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        PLACEHOLDER
                                    </div>
                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4">
                                        <span className="text-xs text-slate-200">
                                            No metrics loaded
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </section>

                        <section className="space-y-4 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link
                                    to="/discover"
                                    className="group flex flex-col min-h-[260px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Discover Profiles
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            Explore →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        PLACEHOLDER
                                    </div>
                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4">
                                        <span className="text-xs text-slate-200">
                                            No profile nodes available
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/forums"
                                    className="group flex flex-col min-h-[180px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Discussion Boards
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            Enter →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        PLACEHOLDER
                                    </div>
                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4">
                                        <span className="text-xs text-slate-200">
                                            No active threads loaded
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/inbox"
                                    className="group flex flex-col min-h-[180px] bg-[#1F6F5F] border border-slate-800/60 rounded-2xl p-5 hover:bg-[#2FA084] hover:border-[#1F6F5F]/40 hover:shadow-xl transition-all duration-150 outline-none focus:ring-2 focus:ring-[#1F6F5F]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-base text-white">
                                            Message Center
                                        </h3>
                                        <span className="text-xs text-white font-semibold group-hover:translate-x-1 transition-transform inline-block">
                                            Open →
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/80 font-medium mb-3 shrink-0">
                                        PLACEHOLDER
                                    </div>
                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-xl p-4">
                                        <span className="text-xs text-slate-200">
                                            No recent communications
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
