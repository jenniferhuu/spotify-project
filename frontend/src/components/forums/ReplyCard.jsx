import { UserIcon } from './ForumIcons';

export default function ReplyCard({ reply }) {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            padding: '18px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <UserIcon className="w-4 h-4" style={{ color: '#2FA084' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#2FA084' }}>
                    {reply.authorName}
                </span>
            </div>
            <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0 }}>
                {reply.body}
            </p>
        </div>
    );
}
