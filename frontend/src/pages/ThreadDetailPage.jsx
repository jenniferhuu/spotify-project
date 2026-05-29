import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReplyCard from "../components/forums/ReplyCard";
import CreateReplyForm from "../components/forums/CreateReplyForm";
import {
    ArrowLeftIcon,
    UserIcon,
    HeartIcon,
    HeartFilledIcon,
} from "../components/forums/ForumIcons";
import {
    fetchThreadDetail,
    deleteThread,
    deleteReply,
    toggleThreadLike,
    toggleReplyLike,
} from "../api/forums";
import { useAuth } from "../context/useAuth.js";

export default function ThreadDetailPage() {
    const { user } = useAuth();
    const { forumId, threadId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const forumTitle = location.state?.forumTitle || "Forum";

    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loadedKey, setLoadedKey] = useState(null);
    const [refreshToken, setRefreshToken] = useState(0);

    const requestKey = `${forumId}:${threadId}:${refreshToken}`;
    const loading = loadedKey !== requestKey;

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await fetchThreadDetail(forumId, threadId);
                if (cancelled) {
                    return;
                }

                const { repliesList, ...threadData } = data;
                setThread(threadData);
                setReplies(repliesList || []);
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
    }, [forumId, requestKey, threadId]);

    function refreshThread() {
        setRefreshToken((current) => current + 1);
    }

    async function handleDeleteThread() {
        if (!user) return;
        try {
            await deleteThread(forumId, threadId, user.spotifyId);
            navigate(`/forums/${forumId}`, { state: { forumTitle } });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteReply(replyId) {
        if (!user) return;
        try {
            await deleteReply(forumId, threadId, replyId, user.spotifyId);
            refreshThread();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLikeThread() {
        if (!user) return;
        const uid = user.spotifyId;
        setThread((prev) => {
            const likedBy = prev.likedBy || [];
            const alreadyLiked = likedBy.includes(uid);
            return {
                ...prev,
                likedBy: alreadyLiked
                    ? likedBy.filter((id) => id !== uid)
                    : [...likedBy, uid],
                likes: (prev.likes || 0) + (alreadyLiked ? -1 : 1),
            };
        });
        try {
            await toggleThreadLike(forumId, threadId, uid);
        } catch (err) {
            console.error(err);
            refreshThread();
        }
    }

    async function handleLikeReply(replyId) {
        if (!user) return;
        const uid = user.spotifyId;
        setReplies((prev) =>
            prev.map((r) => {
                if (r.id !== replyId) return r;
                const likedBy = r.likedBy || [];
                const alreadyLiked = likedBy.includes(uid);
                return {
                    ...r,
                    likedBy: alreadyLiked
                        ? likedBy.filter((id) => id !== uid)
                        : [...likedBy, uid],
                    likes: (r.likes || 0) + (alreadyLiked ? -1 : 1),
                };
            }),
        );
        try {
            await toggleReplyLike(forumId, threadId, replyId, uid);
        } catch (err) {
            console.error(err);
            refreshThread();
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

    const cardStyle = {
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    };

    return (
        <div className="flex h-screen  bg-slate-50">
            <Navbar />
            <main className="ml-52 flex-1 overflow-y-auto">
                <div style={containerStyle}>
                    {/* Section 1 — Back link + thread title */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <button
                            onClick={() =>
                                navigate(`/forums/${forumId}`, {
                                    state: { forumTitle },
                                })
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "none",
                                border: "none",
                                fontSize: "14px",
                                cursor: "pointer",
                                padding: 0,
                                width: "fit-content",
                            }}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to {forumTitle}
                        </button>
                        {!loading && thread && (
                            <h1
                                style={{
                                    fontSize: "clamp(24px, 3vw, 36px)",
                                    fontWeight: "700",
                                    margin: 0,
                                }}
                            >
                                {thread.title}
                            </h1>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Loading...
                        </p>
                    ) : !thread ? (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Thread not found.
                        </p>
                    ) : (
                        <>
                            {/* Section 2 — Original post body */}
                            <div style={cardStyle}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <UserIcon
                                            className="w-4 h-4"
                                            style={{ color: "#2FA084" }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "#2FA084",
                                            }}
                                        >
                                            {thread.authorName}
                                        </span>
                                    </div>
                                    {user &&
                                        thread.authorID === user.spotifyId && (
                                            <button
                                                onClick={handleDeleteThread}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    background: "none",
                                                    border: "1px solid #fca5a5",
                                                    borderRadius: "6px",
                                                    color: "#ef4444",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    padding: "5px 12px",
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "#fee2e2")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "transparent")
                                                }
                                            >
                                                Delete Thread
                                            </button>
                                        )}
                                </div>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#1f2937",
                                        lineHeight: "1.6",
                                        margin: 0,
                                    }}
                                >
                                    {thread.body}
                                </p>
                                {user && (
                                    <button
                                        onClick={handleLikeThread}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: (
                                                thread.likedBy || []
                                            ).includes(user.spotifyId)
                                                ? "#ef4444"
                                                : "#9ca3af",
                                            fontSize: "12px",
                                            padding: "4px 0",
                                            marginTop: "12px",
                                            borderRadius: "6px",
                                            transition: "color 0.15s",
                                        }}
                                        title="Like thread"
                                    >
                                        {(thread.likedBy || []).includes(
                                            user.spotifyId,
                                        ) ? (
                                            <HeartFilledIcon />
                                        ) : (
                                            <HeartIcon />
                                        )}
                                        {thread.likes || 0}
                                    </button>
                                )}
                            </div>

                            {/* Section 3 — Replies */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        color: "#9ca3af",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        margin: 0,
                                    }}
                                >
                                    Replies ({replies.length})
                                </p>
                                {replies.length === 0 ? (
                                    <p
                                        style={{
                                            color: "#6b7280",
                                            fontSize: "14px",
                                        }}
                                    >
                                        No replies yet. Be the first!
                                    </p>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px",
                                        }}
                                    >
                                        {replies.map((reply) => (
                                            <ReplyCard
                                                key={reply.id}
                                                reply={reply}
                                                onDelete={
                                                    user &&
                                                    reply.authorID ===
                                                        user.spotifyId
                                                        ? handleDeleteReply
                                                        : undefined
                                                }
                                                onLike={handleLikeReply}
                                                user={user}
                                            />
                                        ))}
                                    </div>
                                )}
                                <CreateReplyForm
                                    forumId={forumId}
                                    threadId={threadId}
                                    onReplyPosted={refreshThread}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
