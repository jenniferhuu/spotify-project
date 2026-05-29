import { useState } from 'react';
import { UsersIcon, TrashIcon, HeartIcon, HeartFilledIcon } from './ForumIcons';

export default function ForumCard({ forum, onClick, onDelete, onLike, user }) {
    const [confirming, setConfirming] = useState(false);

    function handleTrashClick(e) {
        e.stopPropagation();
        setConfirming(true);
    }

    function handleConfirm(e) {
        e.stopPropagation();
        setConfirming(false);
        onDelete(forum.id);
    }

    function handleCancel(e) {
        e.stopPropagation();
        setConfirming(false);
    }

    return (
        <div
            onClick={confirming ? undefined : onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: `1px solid ${confirming ? '#fca5a5' : '#d1d5db'}`,
                borderRadius: '8px',
                padding: '18px 24px',
                cursor: confirming ? 'default' : 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
                if (confirming) return;
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#2FA084';
            }}
            onMouseLeave={e => {
                if (confirming) return;
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#d1d5db';
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {forum.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                    {forum.description}
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '24px' }}>

                {confirming ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '500' }}>
                            Delete this forum?
                        </span>
                        <button
                            onClick={handleConfirm}
                            style={{
                                padding: '5px 14px',
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleCancel}
                            style={{
                                padding: '5px 14px',
                                backgroundColor: 'transparent',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#9ca3af'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        {user && onLike && (
                            <button
                                onClick={e => { e.stopPropagation(); onLike(forum.id); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: (forum.likedBy || []).includes(user.spotifyId) ? '#ef4444' : '#9ca3af', fontSize: '12px', padding: '4px', borderRadius: '6px', transition: 'color 0.15s' }}
                                title="Like forum"
                            >
                                {(forum.likedBy || []).includes(user.spotifyId) ? <HeartFilledIcon /> : <HeartIcon />}
                                {forum.likes || 0}
                            </button>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af' }}>
                            <UsersIcon className="w-4 h-4" />
                            {forum.threadCount ?? 0}
                        </span>

                        {onDelete && (
                            <button
                                onClick={handleTrashClick}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#9ca3af',
                                    padding: '4px',
                                    borderRadius: '6px',
                                    transition: 'color 0.15s, background 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.background = '#fee2e2';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = '#9ca3af';
                                    e.currentTarget.style.background = 'none';
                                }}
                                title="Delete forum"
                            >
                                <TrashIcon />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
