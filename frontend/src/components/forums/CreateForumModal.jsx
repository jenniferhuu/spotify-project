import { useState } from 'react';
import { createForum } from '../../api/forums';
import { useAuth } from '../../context/AuthProvider';

const fieldStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
};

export default function CreateForumModal({ onClose, onCreated }) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !user) return;
        try {
            setLoading(true);
            await createForum({
                title,
                description,
                createdBy: user.spotifyId,
                createdByName: user.username,
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F6F5F', margin: '0 0 24px' }}>Create Forum</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        placeholder="Forum title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={fieldStyle}
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        style={{ ...fieldStyle, resize: 'none', lineHeight: '1.5' }}
                        rows={4}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '10px 20px', background: 'none', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', color: '#6b7280', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ padding: '10px 24px', backgroundColor: loading ? '#9ca3af' : '#2FA084', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
