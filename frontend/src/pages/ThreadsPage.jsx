import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreadCard from '../components/forums/ThreadCard';
import CreateThreadModal from '../components/forums/CreateThreadModal';
import { fetchThreads, searchThreads } from '../api/forums';

export default function ThreadsPage() {
    const { forumId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const forumTitle = location.state?.forumTitle || 'Forum';
    const [threads, setThreads] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        loadThreads();
    }, [forumId]);
    async function loadThreads() {
        try {
            setLoading(true);
            const data = await fetchThreads(forumId);
            setThreads(data);
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
            if (q.trim() === '') {
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
    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="flex-1 p-8 bg-[#EEEEEE] overflow-y-auto">
                <button
                    onClick={() => navigate('/forums')}
                    className="text-[#2FA084] text-sm mb-4 hover:underline flex items-center gap-1"
                >
                    ← Back to Forums
                </button>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#1F6F5F]">{forumTitle}</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        + Create Thread
                    </button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder={`Search within ${forumTitle}...`}
                    className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084]"
                />
                <div className="flex justify-between text-xs text-gray-400 px-5 mb-2 font-medium uppercase tracking-wide">
                    <span>Thread Title</span>
                    <span>Author</span>
                </div>
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : threads.length === 0 ? (
                    <p className="text-gray-500 text-sm">No threads yet.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {threads.map(thread => (
                            <ThreadCard
                                key={thread.id}
                                thread={thread}
                                onClick={() => navigate(
                                    `/forums/${forumId}/threads/${thread.id}`,
                                    { state: { threadTitle: thread.title, forumTitle } }
                                )}
                            />
                        ))}
                    </div>
                )}
                {showModal && (
                    <CreateThreadModal
                        forumId={forumId}
                        onClose={() => setShowModal(false)}
                        onCreated={loadThreads}
                    />
                )}
            </main>
        </div>
    );
}