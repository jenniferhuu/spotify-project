import { useState } from 'react';
import { createThread } from '../../api/forums';

export default function CreateThreadModal({ forumId, onClose, onCreated }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        try {
            setLoading(true);
            await createThread(forumId, {
                title,
                body,
                authorID: 'temp-user',
                authorName: 'Temp User',
            });
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold text-[#1F6F5F] mb-4">Create Thread</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Thread title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084]"
                        required
                    />
                    <textarea
                        placeholder="What's on your mind?"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084] resize-none"
                        rows={4}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#2FA084] hover:bg-[#1F6F5F] text-white text-sm rounded-md transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post Thread'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}