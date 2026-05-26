export default function SongRow({ index, songData }) {
    const { track } = songData;
    const { album, artists, duration_ms, name, explicit } = track;

    const trackName = name || "Unknown Title";
    const albumName = album?.name || "Unknown Album";
    const albumCover = album?.images?.[0]?.url;

    const artistNames =
        artists?.map((artist) => artist.name).join(", ") || "Unknown Artist";

    const minutes = Math.floor((duration_ms || 0) / 60000);
    const seconds = (((duration_ms || 0) % 60000) / 1000).toFixed(0);
    const formattedDuration = `${minutes}:${seconds.padStart(2, "0")}`;

    return (
        <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-100/70 rounded-xl transition duration-150 shadow-sm border border-slate-100 group">
            <div className="flex items-center gap-4">
                <span className="w-5 text-sm text-slate-400 font-medium text-center">
                    {index}
                </span>

                <img
                    src={albumCover}
                    alt={`${albumName} cover`}
                    className="w-11 h-11 rounded-lg object-cover shadow-sm bg-slate-100 shrink-0"
                />

                <div>
                    <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        {trackName}
                        {explicit && (
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold tracking-wide">
                                E
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-50 sm:max-w-xs">
                        {artistNames}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-8 text-xs font-semibold text-slate-400">
                <span className="hidden md:inline w-44 truncate text-left">
                    {albumName}
                </span>
                <span className="w-10 text-right font-medium text-slate-500">
                    {formattedDuration}
                </span>
            </div>
        </div>
    );
}
