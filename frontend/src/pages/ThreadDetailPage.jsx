import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReplyCard from '../components/forums/ReplyCard';
import CreateReplyForm from '../components/forums/CreateReplyForm';
import { ArrowLeftIcon, UserIcon } from '../components/forums/ForumIcons';
import { fetchThreadDetail } from '../api/forums';

export default function ThreadDetailPage() {
    const { forumId, threadId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const forumTitle = location.state?.forumTitle || 'Forum';

    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThread();
    }, [threadId]);

    async function loadThread() {
        try {
            setLoading(true);
            const data = await fetchThreadDetail(forumId, threadId);
            const { repliesList, ...threadData } = data;
            setThread(threadData);
            setReplies(repliesList || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(24px, 3vh, 40px) clamp(32px, 4vw, 64px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(24px, 4vh, 48px)',
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    };

    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="flex-1 bg-[#EEEEEE] overflow-y-auto">
                <div style={containerStyle}>

                    {/* Section 1 — Back link + thread title */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => navigate(`/forums/${forumId}`, { state: { forumTitle } })}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#2FA084', fontSize: '14px', cursor: 'pointer', padding: 0, width: 'fit-content' }}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to {forumTitle}
                        </button>
                        {!loading && thread && (
                            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '700', color: '#1F6F5F', margin: 0 }}>
                                {thread.title}
                            </h1>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
                    ) : !thread ? (
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Thread not found.</p>
                    ) : (
                        <>
                            {/* Section 2 — Original post body */}
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <UserIcon className="w-4 h-4" style={{ color: '#2FA084' }} />
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2FA084' }}>
                                        {thread.authorName}
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0 }}>
                                    {thread.body}
                                </p>
                            </div>

                            {/* Section 3 — Replies */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                    Replies ({replies.length})
                                </p>
                                {replies.length === 0 ? (
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>No replies yet. Be the first!</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {replies.map(reply => (
                                            <ReplyCard key={reply.id} reply={reply} />
                                        ))}
                                    </div>
                                )}
                                <CreateReplyForm
                                    forumId={forumId}
                                    threadId={threadId}
                                    onReplyPosted={loadThread}
                                />
                            </div>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}
