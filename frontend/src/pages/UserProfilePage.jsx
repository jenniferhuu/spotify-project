import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const API_URL = "http://127.0.0.1:5001";

const rangeOptions = [
    { id: "allTime", label: "All Time" },
    { id: "lastYear", label: "Last Year" },
    { id: "lastMonth", label: "Last Month" },
];

function getStoredSpotifyUser() {
    const possibleKeys = ["spotifyUser", "user", "currentUser"];

    for (const key of possibleKeys) {
        const stored = localStorage.getItem(key);

        if (!stored) continue;

        try {
            return JSON.parse(stored);
        } catch {
            continue;
        }
    }

    return {};
}

function UserProfilePage() {
    const spotifyUser = getStoredSpotifyUser();

    const displayName = spotifyUser.username || spotifyUser.display_name || "User";
    const profilePic = spotifyUser.profilePic || spotifyUser.images?.[0]?.url || "";

    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);

    const [topArtists, setTopArtists] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);

    const [profile, setProfile] = useState({
        username: displayName,
        bio: "User bio",
        joinDate: "May 2026",
        isPublic: true,
        messagePermission: "Everyone",
        profileLink: `${window.location.origin}/profile`,
        showTopArtists: true,
        showTopSongs: true,
        showLikedSongs: true,
        artistRange: "allTime",
        songRange: "allTime",
    });

    useEffect(() => {
        setProfile((prev) => ({
            ...prev,
            username: displayName,
            profileLink: `${window.location.origin}/profile/${displayName}`,
        }));
    }, [displayName]);

    useEffect(() => {
        async function loadProfileData() {
            try {
                const [topSongsResponse, likedSongsResponse] = await Promise.all([
                    axios.get(`${API_URL}/topSongs`, {
                        params: {
                            range: profile.songRange,
                        },
                    }),
                    axios.get(`${API_URL}/songs/likedsongs`),
                ]);

                setTopSongs(topSongsResponse.data.items ?? []);
                setLikedSongs(likedSongsResponse.data.items ?? []);
            } catch (error) {
                console.error("Failed to load profile Spotify data:", error);
            }
        }

        loadProfileData();
    }, [profile.songRange]);

    useEffect(() => {
        async function loadTopArtists() {
            try {
                const response = await axios.get(`${API_URL}/topArtists`, {
                    params: {
                        range: profile.artistRange,
                    },
                });

                setTopArtists(response.data.items ?? []);
            } catch (error) {
                console.error("Failed to load top artists:", error);
                setTopArtists([]);
            }
        }

        loadTopArtists();
    }, [profile.artistRange]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setProfile((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function updateRange(field, value) {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function copyProfileLink() {
        try {
            await navigator.clipboard.writeText(profile.profileLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Failed to copy profile link:", error);
        }
    }

    function saveProfile() {
        setIsEditing(false);
    }

    const previewArtists = topArtists.slice(0, 4);
    const previewSongs = topSongs.slice(0, 3);
    const previewLikedSongs = likedSongs.slice(0, 4);

    return (
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto px-8 py-8 text-black">
                <div className="mx-auto max-w-[1320px]">
                    <header className="mb-7 flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                                My Profile
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Customize how other music fans see and connect with you.
                            </p>
                        </div>

                        <div className="hidden rounded-full bg-white px-4 py-2 text-sm shadow-sm lg:block">
                            Status:{" "}
                            <span
                                className={
                                    profile.isPublic
                                        ? "text-[#176b5a]"
                                        : "text-gray-500"
                                }
                            >
                                {profile.isPublic ? "Public" : "Private"}
                            </span>
                        </div>
                    </header>

                    <div className="grid items-start gap-10 xl:grid-cols-[1.35fr_0.95fr]">
                        <section className="space-y-6">
                            <section className="rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
                                <div className="grid gap-7 lg:grid-cols-[110px_1fr_auto]">
                                    <div className="flex justify-start">
                                        {profilePic ? (
                                            <img
                                                src={profilePic}
                                                alt={`${profile.username} profile`}
                                                className="h-24 w-24 rounded-full object-cover bg-[#d9d9d9]"
                                            />
                                        ) : (
                                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#d9d9d9] text-4xl text-white">
                                                ♫
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        {isEditing ? (
                                            <div className="grid gap-3">
                                                <input
                                                    name="username"
                                                    value={profile.username}
                                                    onChange={handleChange}
                                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                    placeholder="Username"
                                                />

                                                <textarea
                                                    name="bio"
                                                    value={profile.bio}
                                                    onChange={handleChange}
                                                    className="min-h-24 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                    placeholder="Bio"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-xl font-bold">
                                                    {profile.username}
                                                </h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    @{profile.username}
                                                </p>
                                                <p className="mt-4 max-w-xl text-base">
                                                    {profile.bio}
                                                </p>
                                                <p className="mt-5 text-sm text-gray-600">
                                                    Joined {profile.joinDate}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            isEditing
                                                ? saveProfile
                                                : () => setIsEditing(true)
                                        }
                                        className="h-fit rounded-md bg-[#74ce97] px-7 py-2 text-sm font-semibold hover:bg-[#63c98b]"
                                    >
                                        {isEditing ? "Save Profile" : "Edit Profile"}
                                    </button>
                                </div>

                                <div className="mt-7 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4">
                                    <div>
                                        <h3 className="font-bold">Public Profile</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Toggle off to hide your profile from Discover.
                                        </p>
                                    </div>

                                    <Toggle
                                        name="isPublic"
                                        checked={profile.isPublic}
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>

                            <section className="rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
                                <h2 className="text-xl font-bold">
                                    Choose what appears on your public profile
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Pick which Spotify activity sections visitors can see.
                                </p>

                                <div className="mt-6 grid gap-4">
                                    <DisplayRow
                                        icon="🎧"
                                        title="Top Artists"
                                        subtitle="Show your favorite artists from a selected time range."
                                        name="showTopArtists"
                                        checked={profile.showTopArtists}
                                        onChange={handleChange}
                                    >
                                        <RangeButtons
                                            selected={profile.artistRange}
                                            onSelect={(value) =>
                                                updateRange("artistRange", value)
                                            }
                                        />
                                    </DisplayRow>

                                    <DisplayRow
                                        icon="♫"
                                        title="Top Songs"
                                        subtitle="Show your favorite songs from a selected time range."
                                        name="showTopSongs"
                                        checked={profile.showTopSongs}
                                        onChange={handleChange}
                                    >
                                        <RangeButtons
                                            selected={profile.songRange}
                                            onSelect={(value) =>
                                                updateRange("songRange", value)
                                            }
                                        />
                                    </DisplayRow>

                                    <DisplayRow
                                        icon="♡"
                                        title="Liked Songs"
                                        subtitle="Show a section of your recently liked songs."
                                        name="showLikedSongs"
                                        checked={profile.showLikedSongs}
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>

                            <section className="rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
                                <h2 className="text-xl font-bold">Profile Settings</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Control messaging and sharing options.
                                </p>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-5">
                                        <div className="flex items-start gap-4">
                                            <IconBubble>🔒</IconBubble>
                                            <div className="flex-1">
                                                <h3 className="font-bold">
                                                    Who can message you
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Choose who is allowed to message you.
                                                </p>

                                                <select
                                                    name="messagePermission"
                                                    value={profile.messagePermission}
                                                    onChange={handleChange}
                                                    className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                                >
                                                    <option value="Everyone">
                                                        Everyone
                                                    </option>
                                                    <option value="Friends only">
                                                        Friends only
                                                    </option>
                                                    <option value="No one">
                                                        No one
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-5">
                                        <div className="flex items-start gap-4">
                                            <IconBubble>🌐</IconBubble>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold">
                                                    Profile Link
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Share your profile with others.
                                                </p>

                                                <div className="mt-4 flex">
                                                    <input
                                                        value={profile.profileLink}
                                                        readOnly
                                                        className="min-w-0 flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={copyProfileLink}
                                                        className="rounded-r-md bg-[#74ce97] px-4 py-2 text-sm font-semibold hover:bg-[#63c98b]"
                                                    >
                                                        {copied ? "Copied" : "Copy"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>

                        <section className="xl:sticky xl:top-8">
                            <h2 className="mb-4 text-2xl font-bold">
                                Public Profile Preview
                            </h2>

                            <div className="relative overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                                {!profile.isPublic && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/85 text-center text-sm font-bold">
                                        Your profile is currently private.
                                    </div>
                                )}

                                <div className="h-28 bg-[#176b5a]" />

                                <div className="-mt-11 ml-7">
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt={`${profile.username} profile`}
                                            className="h-24 w-24 rounded-full border-4 border-white object-cover bg-[#d9d9d9]"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#d9d9d9] text-4xl text-white">
                                            ♫
                                        </div>
                                    )}
                                </div>

                                <div className="px-7 pb-5 pt-2">
                                    <h3 className="text-lg font-bold">
                                        {profile.username}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        @{profile.username}
                                    </p>
                                    <p className="mt-2 text-sm">{profile.bio}</p>
                                </div>

                                {profile.showTopArtists && (
                                    <PreviewSection
                                        title={`Top Artists (${getRangeLabel(profile.artistRange)})`}
                                    >
                                        {previewArtists.length === 0 ? (
                                            <EmptyPreview message="No top artists loaded yet." />
                                        ) : (
                                            <div className="grid grid-cols-4 gap-4">
                                                {previewArtists.map((artist, index) => {
                                                    const image =
                                                        artist.images?.[0]?.url ||
                                                        artist.image ||
                                                        artist.imageUrl;

                                                    return (
                                                        <div
                                                            key={artist.id || artist.name || index}
                                                            className="text-center"
                                                        >
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={artist.name}
                                                                    className="mx-auto h-16 w-16 rounded-full object-cover bg-[#dceee2]"
                                                                />
                                                            ) : (
                                                                <div className="mx-auto h-16 w-16 rounded-full bg-[#dceee2]" />
                                                            )}
                                                            <p className="mt-2 truncate text-xs text-gray-600">
                                                                {artist.name ||
                                                                    artist.artist ||
                                                                    `Artist ${index + 1}`}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </PreviewSection>
                                )}

                                {profile.showTopSongs && (
                                    <PreviewSection
                                        title={`Top Songs (${getRangeLabel(profile.songRange)})`}
                                    >
                                        {previewSongs.length === 0 ? (
                                            <EmptyPreview message="No top songs loaded yet." />
                                        ) : (
                                            <div className="space-y-4">
                                                {previewSongs.map((song, index) => {
                                                    const title =
                                                        song.title ||
                                                        song.name ||
                                                        song.track?.name ||
                                                        `Song ${index + 1}`;

                                                    const artist =
                                                        song.artist ||
                                                        song.artists
                                                            ?.map((a) => a.name)
                                                            .join(", ") ||
                                                        song.track?.artists
                                                            ?.map((a) => a.name)
                                                            .join(", ") ||
                                                        "Artist name";

                                                    const image =
                                                        song.album?.images?.[0]?.url ||
                                                        song.track?.album?.images?.[0]?.url;

                                                    return (
                                                        <div
                                                            key={song.id || song.rank || index}
                                                            className="flex items-center gap-4"
                                                        >
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={title}
                                                                    className="h-14 w-14 rounded-md object-cover bg-[#d9d9d9]"
                                                                />
                                                            ) : (
                                                                <div className="h-14 w-14 rounded-md bg-[#d9d9d9]" />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {title}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {artist}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </PreviewSection>
                                )}

                                {profile.showLikedSongs && (
                                    <PreviewSection title="Recently Liked">
                                        {previewLikedSongs.length === 0 ? (
                                            <EmptyPreview message="No liked songs loaded yet." />
                                        ) : (
                                            <div className="grid grid-cols-4 gap-4">
                                                {previewLikedSongs.map((song, index) => {
                                                    const track = song.track || song;
                                                    const title =
                                                        track.name ||
                                                        song.title ||
                                                        `Liked ${index + 1}`;
                                                    const image =
                                                        track.album?.images?.[0]?.url ||
                                                        song.album?.images?.[0]?.url;

                                                    return (
                                                        <div key={track.id || song.id || index}>
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={title}
                                                                    className="aspect-square rounded-md object-cover bg-[#d9d9d9]"
                                                                />
                                                            ) : (
                                                                <div className="aspect-square rounded-md bg-[#d9d9d9]" />
                                                            )}
                                                            <p className="mt-2 truncate text-xs text-gray-600">
                                                                {title}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </PreviewSection>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function getRangeLabel(rangeId) {
    return rangeOptions.find((range) => range.id === rangeId)?.label || "All Time";
}

function EmptyPreview({ message }) {
    return <p className="text-sm text-gray-500">{message}</p>;
}

function DisplayRow({
    icon,
    title,
    subtitle,
    name,
    checked,
    onChange,
    children,
}) {
    return (
        <div className="rounded-lg bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                    <IconBubble>{icon}</IconBubble>

                    <div>
                        <h3 className="font-bold">{title}</h3>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                        )}
                        {children}
                    </div>
                </div>

                <Toggle name={name} checked={checked} onChange={onChange} />
            </div>
        </div>
    );
}

function RangeButtons({ selected, onSelect }) {
    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {rangeOptions.map((range) => (
                <button
                    key={range.id}
                    type="button"
                    onClick={() => onSelect(range.id)}
                    className={`rounded-md border px-4 py-2 text-xs font-semibold ${
                        selected === range.id
                            ? "border-[#74ce97] bg-[#74ce97]"
                            : "border-gray-300 bg-white hover:bg-gray-100"
                    }`}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}

function PreviewSection({ title, children }) {
    return (
        <section className="border-t border-gray-200 px-7 py-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                    type="button"
                    className="rounded-md bg-[#74ce97] px-3 py-1.5 text-xs font-semibold hover:bg-[#63c98b]"
                >
                    View All
                </button>
            </div>

            {children}
        </section>
    );
}

function Toggle({ name, checked, onChange }) {
    return (
        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-[#63c98b]" />
            <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
        </label>
    );
}

function IconBubble({ children }) {
    return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dceee2] text-base">
            {children}
        </span>
    );
}

export default UserProfilePage;