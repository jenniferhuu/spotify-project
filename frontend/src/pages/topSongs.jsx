import { useMemo, useState } from 'react'

const songData = {
	allTime: [
		{ rank: 1, title: 'All Time Song 1', artist: 'Artist Name' },
		{ rank: 2, title: 'All Time Song 2', artist: 'Artist Name' },
		{ rank: 3, title: 'All Time Song 3', artist: 'Artist Name' },
		{ rank: 4, title: 'All Time Song 4', artist: 'Artist Name' },
		{ rank: 5, title: 'All Time Song 5', artist: 'Artist Name' },
		{ rank: 6, title: 'All Time Song 6', artist: 'Artist Name' },
		{ rank: 7, title: 'All Time Song 7', artist: 'Artist Name' },
		{ rank: 8, title: 'All Time Song 8', artist: 'Artist Name' },
		{ rank: 9, title: 'All Time Song 9', artist: 'Artist Name' },
		{ rank: 10, title: 'All Time Song 10', artist: 'Artist Name' },
	],
	lastYear: [
		{ rank: 1, title: 'Last Year Song 1', artist: 'Artist Name' },
		{ rank: 2, title: 'Last Year Song 2', artist: 'Artist Name' },
		{ rank: 3, title: 'Last Year Song 3', artist: 'Artist Name' },
		{ rank: 4, title: 'Last Year Song 4', artist: 'Artist Name' },
		{ rank: 5, title: 'Last Year Song 5', artist: 'Artist Name' },
		{ rank: 6, title: 'Last Year Song 6', artist: 'Artist Name' },
		{ rank: 7, title: 'Last Year Song 7', artist: 'Artist Name' },
		{ rank: 8, title: 'Last Year Song 8', artist: 'Artist Name' },
		{ rank: 9, title: 'Last Year Song 9', artist: 'Artist Name' },
		{ rank: 10, title: 'Last Year Song 10', artist: 'Artist Name' },
	],
	lastMonth: [
		{ rank: 1, title: 'Last Month Song 1', artist: 'Artist Name' },
		{ rank: 2, title: 'Last Month Song 2', artist: 'Artist Name' },
		{ rank: 3, title: 'Last Month Song 3', artist: 'Artist Name' },
		{ rank: 4, title: 'Last Month Song 4', artist: 'Artist Name' },
		{ rank: 5, title: 'Last Month Song 5', artist: 'Artist Name' },
		{ rank: 6, title: 'Last Month Song 6', artist: 'Artist Name' },
		{ rank: 7, title: 'Last Month Song 7', artist: 'Artist Name' },
		{ rank: 8, title: 'Last Month Song 8', artist: 'Artist Name' },
		{ rank: 9, title: 'Last Month Song 9', artist: 'Artist Name' },
		{ rank: 10, title: 'Last Month Song 10', artist: 'Artist Name' },
	],
}

const filters = [
	{ id: 'allTime', label: 'All Time' },
	{ id: 'lastYear', label: 'Last Year' },
	{ id: 'lastMonth', label: 'Last Month' },
]

export default function TopSongs() {
	const [selectedFilter, setSelectedFilter] = useState('allTime')

	const songs = useMemo(() => songData[selectedFilter], [selectedFilter])
	const topThree = songs.slice(0, 3)
	const remainingSongs = songs.slice(3)

	return (
		<main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 text-left sm:px-8 lg:px-12">
			<section className="space-y-3">
				<p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
					Spotify Project
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
					Your Top Songs
				</h1>
				<p className="text-base text-slate-600 sm:text-lg">
					Songs you&apos;ve listened to the most.
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
				{topThree.map((song) => (
					<article
						key={song.rank}
						className="flex min-h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
					>
						<div className="space-y-2">
							<p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
								Rank {song.rank}
							</p>
							<h2 className="text-xl font-semibold text-slate-950">
								{song.title}
							</h2>
							<p className="text-sm text-slate-600">{song.artist}</p>
						</div>
						<p className="pt-8 text-sm text-slate-400">Data to be populated later</p>
					</article>
				))}
			</section>

			<section className="mt-10 space-y-4">
				<h2 className="text-lg font-semibold tracking-tight text-slate-900">
					More Songs
				</h2>

				<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					<table className="w-full border-collapse text-left">
						<thead className="bg-slate-50">
							<tr className="text-sm font-medium text-slate-600">
								<th className="px-5 py-4">Rank</th>
								<th className="px-5 py-4">Song</th>
								<th className="px-5 py-4">Artist</th>
							</tr>
						</thead>
						<tbody>
							{remainingSongs.map((song) => (
								<tr key={song.rank} className="border-t border-slate-200 text-slate-700">
									<td className="px-5 py-4 font-medium text-slate-500">{song.rank}</td>
									<td className="px-5 py-4 font-medium text-slate-900">{song.title}</td>
									<td className="px-5 py-4 text-slate-600">{song.artist}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	)
}
