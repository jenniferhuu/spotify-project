import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Discover() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then((res) => res.json())
            .then((data) => setUsers(data.users))
            .catch((err) => console.error("Failed to fetch users:", err));
    }, []);

    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.spotifyId.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            <Navbar />

            <div className="ml-52 min-h-screen p-8">
                <section className="space-y-3 mb-5">
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Discover People
                    </h1>
                    <p className="text-base text-slate-600 sm:text-lg">
                        All public users on the platform
                    </p>
                </section>
                <div className="relative mb-6 max-w-2xl">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or handle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
                    />
                </div>

                <p className="text-sm text-slate-500 mb-4">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "person" : "people"}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {filtered.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => navigate(`/user/${user.spotifyId}`)}
                            className="bg-white rounded-xl shadow-sm border border-[#1F6F5F]/30 px-4 py-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                        >
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.username}
                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                                    <svg
                                        className="w-10 h-10 text-slate-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                </div>
                            )}

                            <p className="font-bold text-slate-900 text-sm">
                                @{user.handle || user.username}
                            </p>
                            <p className="text-slate-500 text-xs mb-3">
                                {user.topGenre || "Music lover"}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        `/inbox?startChat=${user.spotifyId}`,
                                    );
                                }}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F6F5F] text-[#1F6F5F] text-xs font-medium hover:bg-[#1F6F5F] hover:text-white transition-colors duration-150 cursor-pointer"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
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
                    ))}
                </div>
            </div>
        </div>
    );
}
