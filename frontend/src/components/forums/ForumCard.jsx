export default function ForumCard({ forum, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between bg-white px-5 py-4 rounded-md border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        >
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{forum.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{forum.description}</p>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
                👥 {forum.threadCount ?? 0}
            </span>
        </div>
    );
}