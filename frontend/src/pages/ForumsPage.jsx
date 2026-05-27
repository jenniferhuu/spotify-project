import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ForumCard from '../components/forums/ForumCard';
import CreateForumModal from '../components/forums/CreateForumModal';
import { fetchForums, searchForums } from '../api/forums';

export default function ForumsPage() {
    const [forums, setForums] = useState([]);
    const [search, setSearch] = useState('');
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
            if (q.trim() === '') {
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

    return (
        <div className="flex h-screen">
            <Navbar />
            <main className="flex-1 p-8 bg-[#EEEEEE] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-[#1F6F5F]">MUSIC FORUMS</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        + Create Forum
                    </button>
                </div>

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search Forums"
                    className="w-full px-4 py-2 mb-6 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084]"
                />

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : forums.length === 0 ? (
                    <p className="text-gray-500 text-sm">No forums yet. Create one</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {forums.map(forum => (
                            <ForumCard
                                key={forum.id}
                                forum={forum}
                                onClick={() => navigate(`/forums/${forum.id}`, { state: { forumTitle: forum.title } })}
                            />
                        ))}
                    </div>
                )}

                {showModal && (
                    <CreateForumModal
                        onClose={() => setShowModal(false)}
                        onCreated={loadForums}
                    />
                )}
            </main>
        </div>
    );
}