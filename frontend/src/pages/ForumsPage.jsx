import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ForumCard from "../components/forums/ForumCard";
import CreateForumModal from "../components/forums/CreateForumModal";
import { SearchIcon, PlusIcon } from "../components/forums/ForumIcons";
import { fetchForums, searchForums, deleteForum, toggleForumLike } from "../api/forums";
import { useAuth } from "../context/useAuth.js";

export default function ForumsPage() {
    const { user, isAuthenticated } = useAuth();
    const [forums, setForums] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadForums();
    }, []);

    async function loadForums() {
        try {
            setLoading(true);
            const data = await fetchForums();
            setForums(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e) {
        const q = e.target.value;
        setSearch(q);
        try {
            if (q.trim() === "") {
                const data = await fetchForums();
                setForums(data);
            } else {
                const data = await searchForums(q);
                setForums(data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(forumId) {
        if (!user) return;
        try {
            await deleteForum(forumId, user.spotifyId);
            loadForums();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLikeForum(forumId) {
        if (!user) return;
        const uid = user.spotifyId;
        setForums(prev => prev.map(f => {
            if (f.id !== forumId) return f;
            const likedBy = f.likedBy || [];
            const alreadyLiked = likedBy.includes(uid);
            return {
                ...f,
                likedBy: alreadyLiked ? likedBy.filter(id => id !== uid) : [...likedBy, uid],
                likes: (f.likes || 0) + (alreadyLiked ? -1 : 1),
            };
        }));
        try {
            await toggleForumLike(forumId, uid);
        } catch (err) {
            console.error(err);
            loadForums();
        }
    }

    const myForums = isAuthenticated
        ? forums.filter((f) => f.createdBy === user.spotifyId)
        : [];
    const otherForums = isAuthenticated
        ? forums.filter((f) => f.createdBy !== user.spotifyId)
        : forums;

    const sectionLabel = {
        fontSize: "11px",
        fontWeight: "600",
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: 0,
    };

    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="ml-52 flex-1 bg-[#EEEEEE] overflow-y-auto">
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding:
                            "clamp(24px, 3vh, 40px) clamp(32px, 4vw, 64px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(24px, 4vh, 48px)",
                    }}
                >
                    {/* Section 1 — App title */}
                    <div>
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#1F6F5F",
                            }}
                        >
                            APP NAME
                        </span>
                    </div>

                    {/* Section 2 — Page title + search + create */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "clamp(28px, 4vw, 42px)",
                                fontWeight: "700",
                                color: "#1F6F5F",
                                margin: 0,
                            }}
                        >
                            MUSIC FORUMS
                        </h1>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search Forums"
                                    style={{
                                        width: "100%",
                                        padding: "14px 48px 14px 16px",
                                        borderRadius: "12px",
                                        border: "1px solid #d1d5db",
                                        backgroundColor: "#fff",
                                        fontSize: "14px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        height: "52px",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        pointerEvents: "none",
                                        color: "#9ca3af",
                                    }}
                                >
                                    <SearchIcon className="w-5 h-5" />
                                </span>
                            </div>
                            {isAuthenticated && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        backgroundColor: "#2FA084",
                                        color: "#fff",
                                        padding: "0 28px",
                                        borderRadius: "12px",
                                        border: "none",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                        height: "52px",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#1F6F5F")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            "#2FA084")
                                    }
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Create Forum
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Section 3 — Forum cards */}
                    {loading ? (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Loading...
                        </p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "32px",
                            }}
                        >
                            {/* My Forums */}
                            {isAuthenticated && myForums.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}
                                >
                                    <p style={sectionLabel}>My Forums</p>
                                    {myForums.map((forum) => (
                                        <ForumCard
                                            key={forum.id}
                                            forum={forum}
                                            onClick={() =>
                                                navigate(
                                                    `/forums/${forum.id}`,
                                                    {
                                                        state: {
                                                            forumTitle:
                                                                forum.title,
                                                        },
                                                    },
                                                )
                                            }
                                            onDelete={handleDelete}
                                            onLike={handleLikeForum}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Other Forums */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                <p style={sectionLabel}>
                                    {isAuthenticated && myForums.length > 0
                                        ? "Other Forums"
                                        : "Forums"}
                                </p>
                                {otherForums.length === 0 ? (
                                    <p
                                        style={{
                                            color: "#6b7280",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {forums.length === 0
                                            ? "No forums yet. Create one!"
                                            : "No other forums."}
                                    </p>
                                ) : (
                                    otherForums.map((forum) => (
                                        <ForumCard
                                            key={forum.id}
                                            forum={forum}
                                            onClick={() =>
                                                navigate(
                                                    `/forums/${forum.id}`,
                                                    {
                                                        state: {
                                                            forumTitle:
                                                                forum.title,
                                                        },
                                                    },
                                                )
                                            }
                                            onLike={handleLikeForum}
                                            user={user}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <CreateForumModal
                    onClose={() => setShowModal(false)}
                    onCreated={loadForums}
                />
            )}
        </div>
    );
}
