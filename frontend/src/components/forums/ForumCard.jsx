import { UsersIcon } from './ForumIcons';

export default function ForumCard({ forum, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {forum.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                    {forum.description}
                </p>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af', flexShrink: 0, marginLeft: '24px' }}>
                <UsersIcon className="w-4 h-4" />
                {forum.threadCount ?? 0}
            </span>
        </div>
    );
}
