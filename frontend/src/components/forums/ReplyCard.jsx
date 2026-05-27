export default function ReplyCard({ reply }) {
    return (
        <div className="bg-white px-5 py-4 rounded-md border border-gray-200">
            <span className="text-xs font-semibold text-[#2FA084]">{reply.authorName}</span>
            <p className="text-sm text-gray-800 mt-1">{reply.body}</p>
        </div>
    );
}