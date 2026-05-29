import { Router } from "express";
import {
    findOrCreateChat,
    listChatsForUser,
    getMessagesForChat,
    sendMessage,
    markChatAsRead,
} from "../db/chatService.js";
import { findUserBySpotifyId } from "../db/userService.js";

const router = Router();

router.post("/find-or-create", async (req, res) => {
    try {
        const { currentUserSpotifyId, otherUserSpotifyId } = req.body;

        if (!currentUserSpotifyId || !otherUserSpotifyId) {
            return res.status(400).json({ error: "Both user IDs are required" });
        }
        if (currentUserSpotifyId === otherUserSpotifyId) {
            return res.status(400).json({ error: "Cannot create chat with yourself" });
        }

        const chat = await findOrCreateChat(currentUserSpotifyId, otherUserSpotifyId);
        res.json({ chat });
    } catch (err) {
        console.error("Error finding/creating chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/user/:spotifyId", async (req, res) => {
    try {
        const chats = await listChatsForUser(req.params.spotifyId);

        const enriched = await Promise.all(
            chats.map(async (chat) => {
                const otherSpotifyId = chat.participants.find(
                    (p) => p !== req.params.spotifyId,
                );
                const otherUser = await findUserBySpotifyId(otherSpotifyId);
                return {
                    id: chat.id,
                    lastMessage: chat.lastMessage,
                    lastMessageSenderId: chat.lastMessageSenderId,
                    updatedAt: chat.updatedAt,
                    unreadCount: chat.unreadCounts?.[req.params.spotifyId] || 0,
                    otherUser: otherUser
                        ? {
                              spotifyId: otherUser.spotifyId,
                              username: otherUser.username,
                              profilePic: otherUser.profilePic || "",
                              handle: otherUser.handle || "",
                          }
                        : { spotifyId: otherSpotifyId, username: "Unknown User", profilePic: "", handle: "" },
                };
            }),
        );

        res.json({ chats: enriched });
    } catch (err) {
        console.error("Error listing chats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:chatId/messages", async (req, res) => {
    try {
        const messages = await getMessagesForChat(req.params.chatId);
        res.json({ messages });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/:chatId/messages", async (req, res) => {
    try {
        const { senderId, recipientId, text } = req.body;

        if (!senderId || !recipientId || !text?.trim()) {
            return res.status(400).json({ error: "senderId, recipientId, and text are required" });
        }

        const message = await sendMessage(req.params.chatId, senderId, recipientId, text.trim());
        res.status(201).json({ message });
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch("/:chatId/read", async (req, res) => {
    try {
        const { spotifyId } = req.body;

        if (!spotifyId) {
            return res.status(400).json({ error: "spotifyId is required" });
        }

        await markChatAsRead(req.params.chatId, spotifyId);
        res.json({ success: true });
    } catch (err) {
        console.error("Error marking chat as read:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
