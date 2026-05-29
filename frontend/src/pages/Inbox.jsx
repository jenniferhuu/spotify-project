import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth.js";

const API = "http://localhost:5000";

function timeAgo(timestamp) {
    if (!timestamp) return "";
    const ms = typeof timestamp === "number"
        ? timestamp
        : timestamp.seconds
            ? timestamp.seconds * 1000
            : new Date(timestamp).getTime();
    const seconds = Math.floor((Date.now() - ms) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(ms).toLocaleDateString();
}

function formatMessageTime(timestamp) {
    if (!timestamp) return "";
    const ms = typeof timestamp === "number"
        ? timestamp
        : timestamp.seconds
            ? timestamp.seconds * 1000
            : new Date(timestamp).getTime();
    const date = new Date(ms);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (isToday) return `Today \u00B7 ${time}`;
    return `${date.toLocaleDateString()} \u00B7 ${time}`;
}

export default function Inbox() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [showNewModal, setShowNewModal] = useState(false);
    const [modalUsers, setModalUsers] = useState([]);
    const [modalSearch, setModalSearch] = useState("");
    const messagesEndRef = useRef(null);
    const startChatHandled = useRef(false);

    const myId = user?.spotifyId;

    const fetchChats = useCallback(async () => {
        if (!myId) return null;
        try {
            const res = await fetch(`${API}/chats/user/${myId}`);
            const data = await res.json();
            return data.chats || [];
        } catch (err) {
            console.error("Failed to fetch chats:", err);
            return null;
        }
    }, [myId]);

    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId) return null;
        try {
            const res = await fetch(`${API}/chats/${chatId}/messages`);
            const data = await res.json();
            return data.messages || [];
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            return null;
        }
    }, []);

    const markAsRead = useCallback(async (chatId) => {
        if (!chatId || !myId) return;
        try {
            await fetch(`${API}/chats/${chatId}/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spotifyId: myId }),
            });
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    }, [myId]);
    
    useEffect(() => {
        const loadChats = () => {
            fetchChats().then(data => { if (data) setChats(data); });
        };
        loadChats();
        const interval = setInterval(loadChats, 10000);
        return () => clearInterval(interval);
    }, [fetchChats]);

    useEffect(() => {
        if (startChatHandled.current) return;
        const startChatId = searchParams.get("startChat");
        if (!startChatId || !myId) return;

        startChatHandled.current = true;
        setSearchParams({}, { replace: true });

        (async () => {
            try {
                const res = await fetch(`${API}/chats/find-or-create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        currentUserSpotifyId: myId,
                        otherUserSpotifyId: startChatId,
                    }),
                });
                const data = await res.json();
                if (data.chat) {
                    setSelectedChatId(data.chat.id);
                    const otherSpotifyId = data.chat.participants.find((p) => p !== myId);
                    const userRes = await fetch(`${API}/users/${otherSpotifyId}`);
                    const userData = await userRes.json();
                    setSelectedUser({
                        spotifyId: userData.spotifyId,
                        username: userData.username,
                        profilePic: userData.profilePic || "",
                        handle: userData.handle || "",
                    });
                    const chatData = await fetchChats();
                    if (chatData) setChats(chatData);
                }
            } catch (err) {
                console.error("Failed to start chat:", err);
            }
        })();
    }, [searchParams, myId, setSearchParams, fetchChats]);

    useEffect(() => {
        if (!selectedChatId) return;
        const loadMessages = () => {
            fetchMessages(selectedChatId).then(data => { if (data) setMessages(data); });
        };
        loadMessages();
        markAsRead(selectedChatId);
        const interval = setInterval(() => {
            loadMessages();
            markAsRead(selectedChatId);
        }, 3000);
        return () => clearInterval(interval);
    }, [selectedChatId, fetchMessages, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectChat = async (chat) => {
        setSelectedChatId(chat.id);
        setSelectedUser(chat.otherUser);
        await markAsRead(chat.id);
        const data = await fetchChats();
        if (data) setChats(data);
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedChatId || !selectedUser) return;
        try {
            await fetch(`${API}/chats/${selectedChatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: myId,
                    recipientId: selectedUser.spotifyId,
                    text: newMessage.trim(),
                }),
            });
            setNewMessage("");
            const msgs = await fetchMessages(selectedChatId);
            if (msgs) setMessages(msgs);
            const chatData = await fetchChats();
            if (chatData) setChats(chatData);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const openNewMessage = async () => {
        setShowNewModal(true);
        try {
            const res = await fetch(`${API}/users`);
            const data = await res.json();
            setModalUsers((data.users || []).filter((u) => u.spotifyId !== myId));
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    const handleNewChatSelect = async (targetUser) => {
        setShowNewModal(false);
        setModalSearch("");
        try {
            const res = await fetch(`${API}/chats/find-or-create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentUserSpotifyId: myId,
                    otherUserSpotifyId: targetUser.spotifyId,
                }),
            });
            const data = await res.json();
            if (data.chat) {
                setSelectedChatId(data.chat.id);
                setSelectedUser({
                    spotifyId: targetUser.spotifyId,
                    username: targetUser.username,
                    profilePic: targetUser.profilePic || "",
                    handle: targetUser.handle || "",
                });
                const chatData = await fetchChats();
                if (chatData) setChats(chatData);
            }
        } catch (err) {
            console.error("Failed to create chat:", err);
        }
    };

    const filteredChats = chats
        .filter((c) => {
            if (filter === "unread") return c.unreadCount > 0;
            return true;
        })
        .filter((c) =>
            c.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.otherUser?.handle?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

    const filteredModalUsers = modalUsers.filter(
        (u) =>
            u.username?.toLowerCase().includes(modalSearch.toLowerCase()) ||
            u.handle?.toLowerCase().includes(modalSearch.toLowerCase()) ||
            u.spotifyId?.toLowerCase().includes(modalSearch.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            <Navbar />
            <div className="ml-52 h-screen flex">
                {/* Left Panel - Chat List */}
                <div className="w-[380px] border-r border-gray-200 bg-white flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 pb-3">
                        <div className="flex items-center justify-between mb-1">
                            <h1 className="text-xl font-bold text-slate-900">Inbox</h1>
                            <button
                                onClick={openNewMessage}
                                className="px-3 py-1.5 rounded-full border border-[#1F6F5F] text-[#1F6F5F] text-xs font-medium hover:bg-[#1F6F5F] hover:text-white transition-colors duration-150 cursor-pointer"
                            >
                                + New message
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                            Filter by All &middot; Unread
                        </p>

                        {/* Search */}
                        <div className="relative mb-3">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
                            />
                        </div>

                        {/* Filter pills */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                    filter === "all"
                                        ? "bg-[#1F6F5F] text-white"
                                        : "border border-[#1F6F5F] text-[#1F6F5F] hover:bg-[#1F6F5F]/10"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                                    filter === "unread"
                                        ? "bg-[#1F6F5F] text-white"
                                        : "border border-[#1F6F5F] text-[#1F6F5F] hover:bg-[#1F6F5F]/10"
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                Unread
                            </button>
                        </div>
                    </div>

                    {/* Chat list */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center mt-10">
                                No conversations yet
                            </p>
                        ) : (
                            filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat)}
                                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors border-l-3 ${
                                        selectedChatId === chat.id
                                            ? "bg-[#1F6F5F]/10 border-l-[#1F6F5F]"
                                            : "hover:bg-slate-50 border-l-transparent"
                                    }`}
                                >
                                    {/* Avatar */}
                                    {chat.otherUser?.profilePic ? (
                                        <img
                                            src={chat.otherUser.profilePic}
                                            alt={chat.otherUser.username}
                                            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Chat info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${chat.unreadCount > 0 ? "font-bold text-slate-900" : "font-medium text-slate-900"}`}>
                                                {chat.otherUser?.username || "Unknown"}
                                            </p>
                                            <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                                                {timeAgo(chat.updatedAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-500 truncate">
                                                {chat.lastMessageSenderId === myId && chat.lastMessage
                                                    ? `You: ${chat.lastMessage}`
                                                    : chat.lastMessage || "No messages yet"}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#1F6F5F] text-white text-xs flex items-center justify-center font-medium">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel - Chat Window */}
                <div className="flex-1 flex flex-col h-full bg-slate-50">
                    {selectedChatId && selectedUser ? (
                        <>
                            {/* Chat header */}
                            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-3">
                                {selectedUser.profilePic ? (
                                    <img
                                        src={selectedUser.profilePic}
                                        alt={selectedUser.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {selectedUser.username}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        @{selectedUser.handle || selectedUser.username}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                                {messages.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center mt-10">
                                        No messages yet. Say hello!
                                    </p>
                                ) : (
                                    <>
                                        {messages.map((msg, i) => {
                                            const isMine = msg.senderId === myId;
                                            const showTime =
                                                i === 0 ||
                                                (() => {
                                                    const prev = messages[i - 1];
                                                    const prevMs = prev?.createdAt?.seconds
                                                        ? prev.createdAt.seconds * 1000
                                                        : 0;
                                                    const currMs = msg.createdAt?.seconds
                                                        ? msg.createdAt.seconds * 1000
                                                        : 0;
                                                    return currMs - prevMs > 300000;
                                                })();

                                            return (
                                                <div key={msg.id}>
                                                    {showTime && (
                                                        <p className="text-xs text-slate-400 text-center my-4">
                                                            {formatMessageTime(msg.createdAt)}
                                                        </p>
                                                    )}
                                                    <div
                                                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div
                                                            className={`max-w-[70%] px-4 py-2.5 text-sm ${
                                                                isMine
                                                                    ? "bg-[#1F6F5F] text-white rounded-2xl rounded-br-sm"
                                                                    : "bg-gray-100 text-slate-900 rounded-2xl rounded-bl-sm"
                                                            }`}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input */}
                            <div className="px-6 py-4 bg-white border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim()}
                                        className="w-10 h-10 rounded-full bg-[#1F6F5F] text-white flex items-center justify-center hover:bg-[#176b5a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-slate-500 font-medium">Select a conversation</p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Choose a chat or start a new message
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            {showNewModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => { setShowNewModal(false); setModalSearch(""); }}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-slate-900">New Message</h2>
                                <button
                                    onClick={() => { setShowNewModal(false); setModalSearch(""); }}
                                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={modalSearch}
                                onChange={(e) => setModalSearch(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F] focus:border-transparent"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {filteredModalUsers.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    No users found
                                </p>
                            ) : (
                                filteredModalUsers.map((u) => (
                                    <div
                                        key={u.spotifyId}
                                        onClick={() => handleNewChatSelect(u)}
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                        {u.profilePic ? (
                                            <img
                                                src={u.profilePic}
                                                alt={u.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {u.username}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                @{u.handle || u.username}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
