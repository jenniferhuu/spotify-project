import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const filters = [
    { id: "allTime", label: "All Time" },
    { id: "lastYear", label: "Last Year" },
    { id: "lastMonth", label: "Last Month" },
];

function getSpotifyToken() {
    return (
        localStorage.getItem("songs_app_token") ||
        localStorage.getItem("spotifyToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token")
    );
}

export default function TopArtistsPage() {
    const [selectedFilter, setSelectedFilter] = useState("allTime");
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadTopArtists() {
            setIsLoading(true);
            setError("");

            try {
                const token = getSpotifyToken();

                console.log("Top artists token found:", Boolean(token));
                console.log(
                    "Top artists token preview:",
                    token ? token.slice(0, 12) : "none",
                );

                if (!token) {
                    throw new Error("Missing Spotify token");
                }

                const response = await axios.get(
                    "http://127.0.0.1:5001/topArtists",
                    {
                        params: {
                            range: selectedFilter,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                console.log("Top artists response:", response.data);

                if (isMounted) {
                    setArtists(response.data.items ?? []);
                }
            } catch (fetchError) {
                console.error("Failed to fetch top artists:", fetchError);
                console.error(
                    "Failed request:",
                    fetchError.response?.data || fetchError,
                );
                console.error("Status:", fetchError.response?.status);

                if (isMounted) {
                    setError("Unable to load top artists right now.");
                    setArtists([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadTopArtists();

        return () => {
            isMounted = false;
        };
    }, [selectedFilter]);

    const topThree = artists.slice(0, 3);
    const remainingArtists = artists.slice(3);

    return (
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
            <Navbar />

            <main className="flex-1 px-6 py-10 text-left sm:px-8 lg:px-12 overflow-y-auto">
                <section className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Your Top Artists
                    </h1>
                    <p className="text-base text-slate-600 sm:text-lg">
                        Artists you&apos;ve listened to the most.
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
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
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
                            Loading top artists...
                        </div>
                    ) : error ? (
                        <div className="md:col-span-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-10 text-center text-rose-700">
                            {error}
                        </div>
                    ) : topThree.length === 0 ? (
                        <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-slate-500">
                            No top artists found.
                        </div>
                    ) : (
                        topThree.map((artist) => (
                            <article
                                key={artist.id || artist.rank}
                                className="flex min-h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="space-y-3">
                                    {artist.image ? (
                                        <img
                                            src={artist.image}
                                            alt={`${artist.name} profile`}
                                            className="h-24 w-24 rounded-full object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                                            🎤
                                        </div>
                                    )}

                                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
                                        Rank {artist.rank}
                                    </p>

                                    <h2 className="text-xl font-semibold text-slate-950">
                                        {artist.name}
                                    </h2>

                                    <p className="text-sm text-slate-600">
                                        {artist.genre}
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
                </section>

                <section className="mt-10 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                        More Artists
                    </h2>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-sm font-medium text-slate-600">
                                    <th className="px-5 py-4">Rank</th>
                                    <th className="px-5 py-4">Artist</th>
                                    <th className="px-5 py-4">Genre</th>
                                </tr>
                            </thead>

                            <tbody>
                                {remainingArtists.map((artist) => (
                                    <tr
                                        key={artist.id || artist.rank}
                                        className="border-t border-slate-200 text-slate-700"
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-500">
                                            {artist.rank}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {artist.image ? (
                                                    <img
                                                        src={artist.image}
                                                        alt={`${artist.name} profile`}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg">
                                                        🎤
                                                    </div>
                                                )}

                                                <span className="font-medium text-slate-900">
                                                    {artist.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {artist.genre}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}