import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

import db from "../firebase.js";

export const findChatByParticipants = async (spotifyId1, spotifyId2) => {
    const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", spotifyId1),
    );
    const snapshot = await getDocs(q);

    for (const d of snapshot.docs) {
        const data = d.data();
        if (data.participants.includes(spotifyId2)) {
            return { id: d.id, ...data };
        }
    }
    return null;
};

const createChat = async (spotifyId1, spotifyId2) => {
    const participants = [spotifyId1, spotifyId2].sort();
    const chatData = {
        participants,
        lastMessage: "",
        lastMessageSenderId: "",
        updatedAt: serverTimestamp(),
        unreadCounts: { [spotifyId1]: 0, [spotifyId2]: 0 },
    };
    const docRef = await addDoc(collection(db, "chats"), chatData);
    return { id: docRef.id, ...chatData };
};

export const findOrCreateChat = async (spotifyId1, spotifyId2) => {
    const existing = await findChatByParticipants(spotifyId1, spotifyId2);
    if (existing) return existing;
    return createChat(spotifyId1, spotifyId2);
};

export const listChatsForUser = async (spotifyId) => {
    const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", spotifyId),
        orderBy("updatedAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getChatById = async (chatId) => {
    const snap = await getDoc(doc(db, "chats", chatId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

export const getMessagesForChat = async (chatId) => {
    const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("createdAt", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const sendMessage = async (chatId, senderId, recipientId, text) => {
    const messageData = {
        chatId,
        senderId,
        recipientId,
        text,
        createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "messages"), messageData);

    await updateDoc(doc(db, "chats", chatId), {
        lastMessage: text,
        lastMessageSenderId: senderId,
        updatedAt: serverTimestamp(),
        [`unreadCounts.${recipientId}`]: (await getUnreadCount(chatId, recipientId)) + 1,
    });

    return { id: docRef.id, ...messageData };
};

const getUnreadCount = async (chatId, spotifyId) => {
    const chat = await getChatById(chatId);
    return chat?.unreadCounts?.[spotifyId] || 0;
};

export const markChatAsRead = async (chatId, spotifyId) => {
    await updateDoc(doc(db, "chats", chatId), {
        [`unreadCounts.${spotifyId}`]: 0,
    });
};
