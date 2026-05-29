import db from "../firebase.js"
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    updateDoc,
    increment,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";


//Forums
export async function listForums() {
    const q = query(collection(db, "forums"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function searchForums(searchQuery) {
    const all = await listForums();
    return all.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

export async function createForum(data) {
    const docRef = await addDoc(collection(db, "forums"), {
        ...data,
        threadCount: 0,
        createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
}

export async function deleteForum(forumId) {
    await deleteDoc(doc(db, "forums", forumId));
}

//Threads
export async function listThreads(forumId) {
    const q = query(
        collection(db, "forums", forumId, "threads"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function searchThreads(forumId, searchQuery) {
    const all = await listThreads(forumId);
    return all.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

export async function createThread(forumId, data) {
    const docRef = await addDoc(
        collection(db, "forums", forumId, "threads"),
        { ...data, replies: 0, createdAt: serverTimestamp() }
    );
    await updateDoc(doc(db, "forums", forumId), {
        threadCount: increment(1),
    });
    return { id: docRef.id };
}

export async function getThread(forumId, threadId) {
    const snap = await getDoc(doc(db, "forums", forumId, "threads", threadId));
    if (!snap.exists()) throw new Error("Thread not found");
    return { id: snap.id, ...snap.data() };
}

export async function deleteThread(forumId, threadId) {
    await deleteDoc(doc(db, "forums", forumId, "threads", threadId));
    await updateDoc(doc(db, "forums", forumId), { threadCount: increment(-1) });
}

//replies
export async function listReplies(forumId, threadId) {
    const q = query(
        collection(db, "forums", forumId, "threads", threadId, "replies"),
        orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getReply(forumId, threadId, replyId) {
    const snap = await getDoc(doc(db, "forums", forumId, "threads", threadId, "replies", replyId));
    if (!snap.exists()) throw new Error("Reply not found");
    return { id: snap.id, ...snap.data() };
}

export async function deleteReply(forumId, threadId, replyId) {
    await deleteDoc(doc(db, "forums", forumId, "threads", threadId, "replies", replyId));
    await updateDoc(doc(db, "forums", forumId, "threads", threadId), { replies: increment(-1) });
}

export async function createReply(forumId, threadId, data) {
    const docRef = await addDoc(
        collection(db, "forums", forumId, "threads", threadId, "replies"),
        { ...data, createdAt: serverTimestamp() }
    );
    await updateDoc(doc(db, "forums", forumId, "threads", threadId), {
        replies: increment(1),
    });
    return { id: docRef.id };
}

// Likes

export async function toggleForumLike(forumId, userId) {
    const ref = doc(db, "forums", forumId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Forum not found");
    const likedBy = snap.data().likedBy || [];
    const alreadyLiked = likedBy.includes(userId);
    await updateDoc(ref, {
        likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
        likes: increment(alreadyLiked ? -1 : 1),
    });
    return { liked: !alreadyLiked, likes: (snap.data().likes || 0) + (alreadyLiked ? -1 : 1) };
}

export async function toggleThreadLike(forumId, threadId, userId) {
    const ref = doc(db, "forums", forumId, "threads", threadId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Thread not found");
    const likedBy = snap.data().likedBy || [];
    const alreadyLiked = likedBy.includes(userId);
    await updateDoc(ref, {
        likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
        likes: increment(alreadyLiked ? -1 : 1),
    });
    return { liked: !alreadyLiked, likes: (snap.data().likes || 0) + (alreadyLiked ? -1 : 1) };
}

export async function toggleReplyLike(forumId, threadId, replyId, userId) {
    const ref = doc(db, "forums", forumId, "threads", threadId, "replies", replyId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Reply not found");
    const likedBy = snap.data().likedBy || [];
    const alreadyLiked = likedBy.includes(userId);
    await updateDoc(ref, {
        likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
        likes: increment(alreadyLiked ? -1 : 1),
    });
    return { liked: !alreadyLiked, likes: (snap.data().likes || 0) + (alreadyLiked ? -1 : 1) };
}