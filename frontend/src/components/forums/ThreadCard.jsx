import { UserIcon, ChatIcon } from './ForumIcons';

export default function ThreadCard({ thread, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '18px 24px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#2FA084';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#d1d5db';
            }}
        >
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                {thread.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, marginLeft: '24px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af' }}>
                    <UserIcon className="w-4 h-4" />
                    {thread.authorName}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af' }}>
                    <ChatIcon className="w-4 h-4" />
                    {thread.replies ?? 0}
                </span>
            </div>
        </div>
    );
}
