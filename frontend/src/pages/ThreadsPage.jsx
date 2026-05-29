import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ThreadCard from "../components/forums/ThreadCard";
import CreateThreadModal from "../components/forums/CreateThreadModal";
import {
    SearchIcon,
    PlusIcon,
    ArrowLeftIcon,
} from "../components/forums/ForumIcons";
import { fetchThreads, searchThreads, deleteThread, toggleThreadLike } from "../api/forums";
import { useAuth } from "../context/useAuth.js";

export default function ThreadsPage() {
    const { user, isAuthenticated } = useAuth();
    const { forumId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const forumTitle = location.state?.forumTitle || "Forum";

    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState("");
    const [loadedKey, setLoadedKey] = useState(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const requestKey = `${forumId}:${refreshToken}`;
    const loading = loadedKey !== requestKey;

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await fetchThreads(forumId);
                if (cancelled) {
                    return;
                }

                setThreads(data);
                setLoadedKey(requestKey);
            } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setLoadedKey(requestKey);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [forumId, requestKey]);

    function refreshThreads() {
        setRefreshToken((current) => current + 1);
    }

    async function handleSearch(e) {
        const q = e.target.value;
        setSearch(q);
        try {
            if (q.trim() === "") {
                const data = await fetchThreads(forumId);
                setThreads(data);
            } else {
                const data = await searchThreads(forumId, q);
                setThreads(data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteThread(threadId) {
        if (!user) return;
        try {
            await deleteThread(forumId, threadId, user.spotifyId);
            refreshThreads();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLikeThread(threadId) {
        if (!user) return;
        const uid = user.spotifyId;
        setThreads(prev => prev.map(t => {
            if (t.id !== threadId) return t;
            const likedBy = t.likedBy || [];
            const alreadyLiked = likedBy.includes(uid);
            return {
                ...t,
                likedBy: alreadyLiked ? likedBy.filter(id => id !== uid) : [...likedBy, uid],
                likes: (t.likes || 0) + (alreadyLiked ? -1 : 1),
            };
        }));
        try {
            await toggleThreadLike(forumId, threadId, uid);
        } catch (err) {
            console.error(err);
            refreshThreads();
        }
    }

    const containerStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(24px, 3vh, 40px) clamp(32px, 4vw, 64px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(24px, 4vh, 48px)",
    };

    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="ml-52 flex-1 bg-[#EEEEEE] overflow-y-auto">
                <div style={containerStyle}>
                    {/* Section 1 — Back link + forum title */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <button
                            onClick={() => navigate("/forums")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "none",
                                border: "none",
                                color: "#2FA084",
                                fontSize: "14px",
                                cursor: "pointer",
                                padding: 0,
                                width: "fit-content",
                            }}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Forums
                        </button>
                        <h1
                            style={{
                                fontSize: "clamp(24px, 3vw, 36px)",
                                fontWeight: "700",
                                color: "#1F6F5F",
                                margin: 0,
                            }}
                        >
                            {forumTitle}
                        </h1>
                    </div>

                    {/* Section 2 — Search + Create Thread */}
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
                                placeholder={`Search within ${forumTitle}...`}
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
                                    height: "52px",
                                    borderRadius: "12px",
                                    border: "none",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
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
                                Create Thread
                            </button>
                        )}
                    </div>

                    {/* Section 3 — Thread list */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0 24px",
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#9ca3af",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}
                        >
                            <span>Thread Title</span>
                            <span>Author</span>
                        </div>
                        {loading ? (
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Loading...
                            </p>
                        ) : threads.length === 0 ? (
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                No threads yet. Start one!
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                {threads.map((thread) => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        onClick={() =>
                                            navigate(
                                                `/forums/${forumId}/threads/${thread.id}`,
                                                {
                                                    state: {
                                                        threadTitle:
                                                            thread.title,
                                                        forumTitle,
                                                    },
                                                },
                                            )
                                        }
                                        onDelete={
                                            user &&
                                            thread.authorID === user.spotifyId
                                                ? handleDeleteThread
                                                : undefined
                                        }
                                        onLike={handleLikeThread}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <CreateThreadModal
                        forumId={forumId}
                        onClose={() => setShowModal(false)}
                        onCreated={refreshThreads}
                    />
                )}
            </main>
        </div>
    );
}
