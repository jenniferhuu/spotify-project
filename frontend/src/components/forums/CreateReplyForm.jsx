import { useState } from 'react';
import { createReply } from '../../api/forums';

export default function CreateReplyForm({ forumId, threadId, onReplyPosted }) {
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        try {
            setLoading(true);
            await createReply(forumId, threadId, {
                body,
                authorID: 'temp-user',
                authorName: 'Temp User',
            });
            setBody('');
            onReplyPosted();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-md border border-gray-200 px-5 py-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Post a Reply</p>
            <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2FA084] resize-none"
                rows={3}
                required
            />
            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#2FA084] hover:bg-[#1F6F5F] text-white text-sm rounded-md transition-colors disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Reply'}
                </button>
            </div>
        </form>
    );
}