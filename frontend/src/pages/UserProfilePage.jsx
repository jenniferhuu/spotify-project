import { useState } from "react";

function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "First",
    lastName: "Last",
    username: "username",
    bio: "User bio",
    joinDate: "May 2026",
    isPublic: true,
    messagePermission: "Everyone",
    profileLink: "https://yourapp.com/profile/username",
    showTopArtists: true,
    showTopSongs: true,
    showLikedSongs: true,
    artistRange: "All Time",
    songRange: "All Time",
  });

  const topArtists = ["Artist 1", "Artist 2", "Artist 3", "Artist 4"];
  const topSongs = ["Song #1", "Song #2", "Song #3"];
  const likedSongs = ["Liked 1", "Liked 2", "Liked 3", "Liked 4"];

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

  return (
    <main className="min-h-screen w-full bg-[#f5f5f5] text-black">
      <div className="flex min-h-screen">
        <aside className="hidden w-[150px] shrink-0 bg-[#176b5a] px-6 py-7 text-sm font-bold text-white md:block">
          Navbar
        </aside>

        <section className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-[1320px]">
            <header className="mb-7 flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Customize how other music fans see and connect with you.
                </p>
              </div>

              <div className="hidden rounded-full bg-white px-4 py-2 text-sm shadow-sm lg:block">
                Status:{" "}
                <span className={profile.isPublic ? "text-[#176b5a]" : "text-gray-500"}>
                  {profile.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </header>

            <div className="grid items-start gap-10 xl:grid-cols-[1.35fr_0.95fr]">
              <section className="space-y-6">
                <section className="rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
                  <div className="grid gap-7 lg:grid-cols-[110px_1fr_auto]">
                    <div className="flex justify-start">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#d9d9d9] text-4xl text-white">
                        ♫
                        <button
                          type="button"
                          className="absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#63c98b] text-xs text-white shadow"
                        >
                          ✎
                        </button>
                      </div>
                    </div>

                    <div>
                      {isEditing ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="First name"
                          />

                          <input
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Last name"
                          />

                          <input
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
                            placeholder="Username"
                          />

                          <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className="min-h-24 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
                            placeholder="Bio"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-bold">
                            {profile.firstName} {profile.lastName}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">@{profile.username}</p>
                          <p className="mt-4 max-w-xl text-base">{profile.bio}</p>
                          <p className="mt-5 text-sm text-gray-600">
                            Joined {profile.joinDate}
                          </p>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={isEditing ? saveProfile : () => setIsEditing(true)}
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
                        onSelect={(value) => updateRange("artistRange", value)}
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
                        onSelect={(value) => updateRange("songRange", value)}
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
                          <h3 className="font-bold">Who can message you</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Choose who is allowed to message you.
                          </p>

                          <select
                            name="messagePermission"
                            value={profile.messagePermission}
                            onChange={handleChange}
                            className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          >
                            <option value="Everyone">Everyone</option>
                            <option value="Friends only">Friends only</option>
                            <option value="No one">No one</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-5">
                      <div className="flex items-start gap-4">
                        <IconBubble>🌐</IconBubble>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">Profile Link</h3>
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
                <h2 className="mb-4 text-2xl font-bold">Public Profile Preview</h2>

                <div className="relative overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                  {!profile.isPublic && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/85 text-center text-sm font-bold">
                      Your profile is currently private.
                    </div>
                  )}

                  <div className="h-28 bg-[#176b5a]" />

                  <div className="-mt-11 ml-7 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#d9d9d9] text-4xl text-white">
                    ♫
                  </div>

                  <div className="px-7 pb-5 pt-2">
                    <h3 className="text-lg font-bold">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">@{profile.username}</p>
                    <p className="mt-2 text-sm">{profile.bio}</p>
                  </div>

                  {profile.showTopArtists && (
                    <PreviewSection title={`Top Artists (${profile.artistRange})`}>
                      <div className="grid grid-cols-4 gap-4">
                        {topArtists.map((artist) => (
                          <div key={artist} className="text-center">
                            <div className="mx-auto h-16 w-16 rounded-full bg-[#dceee2]" />
                            <p className="mt-2 truncate text-xs text-gray-600">{artist}</p>
                          </div>
                        ))}
                      </div>
                    </PreviewSection>
                  )}

                  {profile.showTopSongs && (
                    <PreviewSection title={`Top Songs (${profile.songRange})`}>
                      <div className="space-y-4">
                        {topSongs.map((song) => (
                          <div key={song} className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-md bg-[#d9d9d9]" />
                            <div>
                              <p className="text-sm font-medium">{song}</p>
                              <p className="text-xs text-gray-500">Artist name</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PreviewSection>
                  )}

                  {profile.showLikedSongs && (
                    <PreviewSection title="Recently Liked">
                      <div className="grid grid-cols-4 gap-4">
                        {likedSongs.map((song) => (
                          <div key={song}>
                            <div className="aspect-square rounded-md bg-[#d9d9d9]" />
                            <p className="mt-2 truncate text-xs text-gray-600">{song}</p>
                          </div>
                        ))}
                      </div>
                    </PreviewSection>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
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
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
            {children}
          </div>
        </div>

        <Toggle name={name} checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

function RangeButtons({ selected, onSelect }) {
  const ranges = ["All Time", "Last Year", "Last Month"];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {ranges.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onSelect(range)}
          className={`rounded-md border px-4 py-2 text-xs font-semibold ${
            selected === range
              ? "border-[#74ce97] bg-[#74ce97]"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
        >
          {range}
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