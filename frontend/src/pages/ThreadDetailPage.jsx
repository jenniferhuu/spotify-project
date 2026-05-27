import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReplyCard from '../components/forums/ReplyCard.jsx';
import CreateReplyForm from '../components/forums/CreateReplyForm';
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

    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="flex-1 p-8 bg-[#EEEEEE] overflow-y-auto">
                <button
                    onClick={() => navigate(`/forums/${forumId}`, { state: { forumTitle } })}
                    className="text-[#2FA084] text-sm mb-4 hover:underline flex items-center gap-1"
                >
                    ← Back to {forumTitle}
                </button>

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : !thread ? (
                    <p className="text-gray-500 text-sm">Thread not found.</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-[#1F6F5F]">{thread.title}</h1>
                        </div>

                        <div className="bg-white rounded-md border border-gray-200 px-5 py-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-semibold text-[#2FA084]">{thread.authorName}</span>
                            </div>
                            <p className="text-sm text-gray-800">{thread.body}</p>
                        </div>

                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Replies ({replies.length})
                        </h2>

                        <div className="flex flex-col gap-2 mb-6">
                            {replies.length === 0 ? (
                                <p className="text-gray-500 text-sm">No replies yet. Be the first!</p>
                            ) : (
                                replies.map(reply => (
                                    <ReplyCard key={reply.id} reply={reply} />
                                ))
                            )}
                        </div>

                        <CreateReplyForm
                            forumId={forumId}
                            threadId={threadId}
                            onReplyPosted={loadThread}
                        />
                    </>
                )}
            </main>
        </div>
    );
}