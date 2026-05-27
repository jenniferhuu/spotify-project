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
        <form
            onSubmit={handleSubmit}
            style={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
            }}
        >
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Post a Reply
            </p>
            <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your reply..."
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                }}
                rows={3}
                required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: loading ? '#9ca3af' : '#2FA084',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1F6F5F'; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2FA084'; }}
                >
                    {loading ? 'Posting...' : 'Post Reply'}
                </button>
            </div>
        </form>
    );
}
