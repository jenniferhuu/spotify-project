export default function ThreadCard({ thread, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between bg-white px-5 py-4 rounded-md border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        >
            <span className="text-sm font-medium text-gray-900">{thread.title}</span>
            <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    👤 {thread.authorName}
                </span>
                <span className="flex items-center gap-1">
                    💬 {thread.replies ?? 0}
                </span>
            </div>
        </div>
    );
}