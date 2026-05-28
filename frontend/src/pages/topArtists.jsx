import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/useAuth.js'

const filters = [
    { id: 'allTime', label: 'All Time' },
    { id: 'lastYear', label: 'Last Year' },
    { id: 'lastMonth', label: 'Last Month' },
]

export default function TopArtists() {
    const [selectedFilter, setSelectedFilter] = useState('allTime')
    const [artists, setArtists] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleArtistCount, setVisibleArtistCount] = useState(10)
    const { token } = useAuth()     // Get the Spotify access token from context

    // Use a flag to prevent state updates on unmounted component
    useEffect(() => {
        let isMounted = true

        async function loadTopArtists() {
            if (!token) {
                setArtists([])
                setError('Please log in with Spotify to view your top artists.')
                setVisibleArtistCount(10)
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError('')
            setVisibleArtistCount(10)

            try {
                const response = await axios.get('/topArtists', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        range: selectedFilter,
                    },
                })

                if (isMounted) {
                    setArtists(response.data.items ?? [])
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError(fetchError instanceof Error ? fetchError.message : 'Unable to load top artists right now.')
                    setArtists([])
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadTopArtists()

        return () => {
            isMounted = false
        }
    }, [selectedFilter, token])

    const topThree = artists.slice(0, 3)
    const remainingArtists = artists.slice(3)
    const visibleRemainingArtists = remainingArtists.slice(0, visibleArtistCount)
    const canShowMoreArtists = visibleArtistCount < remainingArtists.length

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            <Navbar />
            <main className="ml-52 min-h-screen min-w-0 px-6 py-10 text-left sm:px-8 lg:px-12">
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
                        const isActive = selectedFilter === filter.id

                        return (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setSelectedFilter(filter.id)}
                                aria-pressed={isActive}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? 'border-slate-900 bg-slate-900 text-white'
                                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                                }`}
                            >
                                {filter.label}
                            </button>
                        )
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
                    ) : (
                        topThree.map((artist) => (
                            <article
                                key={artist.id ?? artist.rank ?? artist.name}
                                className="flex min-h-44 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                {artist.imageUrl ? (
                                    <img
                                        src={artist.imageUrl}
                                        alt={`${artist.name} cover`}
                                        className="aspect-square w-full rounded-xl object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" />
                                )}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
                                        # {artist.rank}
                                    </p>
                                    <h2 className="text-xl font-semibold text-slate-950">
                                        {artist.name}
                                    </h2>
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
                                    <th className="px-5 py-4">#</th>
                                    <th className="px-5 py-4">Cover</th>
                                    <th className="px-5 py-4">Artist</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRemainingArtists.map((artist, index) => (
                                    <tr key={artist.id ?? artist.rank ?? artist.name ?? index} className="border-t border-slate-200 text-slate-700">
                                        <td className="px-5 py-4 font-medium text-slate-500">{artist.rank ?? index + 4}</td>
                                        <td className="px-5 py-4">
                                            {artist.imageUrl ? (
                                                <img
                                                    src={artist.imageUrl}
                                                    alt={`${artist.name} cover`}
                                                    className="h-8 w-8 rounded-lg object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-lg bg-slate-100" />
                                            )}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-slate-900">{artist.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {canShowMoreArtists ? (
                            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVisibleArtistCount((currentCount) =>
                                            Math.min(currentCount + 10, remainingArtists.length),
                                        )
                                    }
                                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                                >
                                    See more artists
                                </button>
                            </div>
                        ) : null}
                    </div>
                </section>
            </main>
        </div>
    )
}
