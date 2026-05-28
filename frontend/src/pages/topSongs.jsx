import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/useAuth.js";

const filters = [
    { id: "allTime", label: "All Time" },
    { id: "lastYear", label: "Last Year" },
    { id: "lastMonth", label: "Last Month" },
];

function getSpotifyToken() {
    return (
        localStorage.getItem("spotifyToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token")
    );
}

export default function TopSongs() {
    const [selectedFilter, setSelectedFilter] = useState("allTime");
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [visibleSongCount, setVisibleSongCount] = useState(10);
    const { token } = useAuth(); // Get the Spotify access token from context

    useEffect(() => {
        let isMounted = true;

        async function loadTopSongs() {
            if (!token) {
                setSongs([]);
                setError("Please log in with Spotify to view your top songs.");
                setVisibleSongCount(10);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError("");
            setVisibleSongCount(10);

            // Fetch top songs, return different error message if the request fails
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/topSongs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send the access token in the header to backend
                        },
                        params: {
                            range: selectedFilter,
                        },
                    },
                );

                if (isMounted) {
                    setSongs(response.data.items ?? []);
                }
            } catch (fetchError) {
                console.error("Failed to fetch top songs:", fetchError);
                console.error(
                    "Failed request:",
                    fetchError.response?.data || fetchError,
                );
                console.error("Status:", fetchError.response?.status);
                if (isMounted) {
                    setError("Unable to load top songs right now.");
                    setSongs([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadTopSongs();

        return () => {
            isMounted = false;
        };
    }, [selectedFilter, token]);

    const topThree = songs.slice(0, 3);
    const remainingSongs = songs.slice(3);

    const visibleRemainingSongs = remainingSongs.slice(0, visibleSongCount);
    const canShowMoreSongs = visibleSongCount < remainingSongs.length;

    return (
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
            <Navbar />

            <main className="ml-52 flex-1 h-full px-6 py-10 text-left sm:px-8 lg:px-12 overflow-y-auto">
                <section className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Your Top Songs
                    </h1>
                    <p className="text-base text-slate-600 sm:text-lg">
                        Songs you&apos;ve listened to the most.
                    </p>
                </section>

                <section className="mt-8 flex flex-wrap gap-3">
                    {filters.map((filter) => {
                        const isActive = selectedFilter === filter.id;

                        return (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setSelectedFilter(filter.id)}
                                aria-pressed={isActive}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "border-[#6FCF97] bg-[#6FCF97] text-white"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-[#6FCF97]"
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </section>

                <section className="mt-8 grid gap-5 md:grid-cols-3">
                    {isLoading ? (
                        <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-slate-500">
                            Loading top songs...
                        </div>
                    ) : error ? (
                        <div className="md:col-span-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-10 text-center text-rose-700">
                            {error}
                        </div>
                    ) : topThree.length === 0 ? (
                        <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-slate-500">
                            No top songs found.
                        </div>
                    ) : (
                        topThree.map((song) => (
                            <article
                                key={song.id || song.rank}
                                className="flex min-h-44 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                {song.imageUrl ? (
                                    <img
                                        src={song.imageUrl}
                                        alt={`${song.album || song.title} cover`}
                                        className="aspect-square w-full rounded-xl object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" />
                                )}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
                                        # {song.rank}
                                    </p>
                                    <h2 className="text-xl font-semibold text-slate-950 truncate">
                                        {song.title}
                                    </h2>
                                    <p className="text-sm text-slate-600 truncate">
                                        {song.artist}
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
                </section>

                {!isLoading && !error && songs.length > 3 && (
                    <section className="mt-10 space-y-4">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                            More Songs
                        </h2>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full border-collapse text-left">
                                <thead className="bg-slate-50">
                                    <tr className="text-sm font-medium text-slate-600">
                                        <th className="px-5 py-4">#</th>
                                        <th className="px-5 py-4">Cover</th>
                                        <th className="px-5 py-4">Song</th>
                                        <th className="px-5 py-4">Artist</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleRemainingSongs.map((song) => (
                                        <tr
                                            key={song.id || song.rank}
                                            className="border-t border-slate-200 text-slate-700 hover:bg-slate-50/50"
                                        >
                                            <td className="px-5 py-4 font-medium text-slate-500">
                                                {song.rank}
                                            </td>
                                            <td className="px-5 py-4">
                                                {song.imageUrl ? (
                                                    <img
                                                        src={song.imageUrl}
                                                        alt={`${song.album || song.title} cover`}
                                                        className="h-8 w-8 rounded-lg object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                                                )}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-900">
                                                {song.title}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">
                                                {song.artist}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {canShowMoreSongs && (
                                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setVisibleSongCount(
                                                (currentCount) =>
                                                    Math.min(
                                                        currentCount + 10,
                                                        remainingSongs.length,
                                                    ),
                                            )
                                        }
                                        className="rounded-full border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 transition dynamic-shadow hover:border-slate-400 hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        See more songs
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
