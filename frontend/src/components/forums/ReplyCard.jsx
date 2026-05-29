import { useState } from 'react';
import { UserIcon, TrashIcon, HeartIcon, HeartFilledIcon } from './ForumIcons';

export default function ReplyCard({ reply, onDelete, onLike, user }) {
    const [confirming, setConfirming] = useState(false);

    return (
        <div style={{
            backgroundColor: '#ffffff',
            border: `1px solid ${confirming ? '#fca5a5' : '#d1d5db'}`,
            borderRadius: '12px',
            padding: '18px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'border-color 0.15s',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon className="w-4 h-4" style={{ color: '#2FA084' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2FA084' }}>
                        {reply.authorName}
                    </span>
                </div>

                {onDelete && (
                    confirming ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '500' }}>
                                Delete this reply?
                            </span>
                            <button
                                onClick={() => { setConfirming(false); onDelete(reply.id); }}
                                style={{ padding: '5px 14px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                style={{ padding: '5px 14px', backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#9ca3af'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '6px', transition: 'color 0.15s, background 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fee2e2'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'none'; }}
                            title="Delete reply"
                        >
                            <TrashIcon />
                        </button>
                    )
                )}
            </div>
            <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0 }}>
                {reply.body}
            </p>
            {user && onLike && (
                <button
                    onClick={() => onLike(reply.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: (reply.likedBy || []).includes(user.spotifyId) ? '#ef4444' : '#9ca3af', fontSize: '12px', padding: '4px 0', marginTop: '8px', borderRadius: '6px', transition: 'color 0.15s' }}
                    title="Like reply"
                >
                    {(reply.likedBy || []).includes(user.spotifyId) ? <HeartFilledIcon /> : <HeartIcon />}
                    {reply.likes || 0}
                </button>
            )}
        </div>
    );
}
