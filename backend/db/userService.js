import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

import db from "../firebase.js";

export const findUserBySpotifyId = async (spotifyId) => {
    const userQuery = query(
        collection(db, "Users"),
        where("spotifyId", "==", spotifyId),
    );
    const snapshot = await getDocs(userQuery);

    if (snapshot.empty) {
        return null;
    }

    const userDoc = snapshot.docs[0];
    return {
        id: userDoc.id,
        ...userDoc.data(),
    };
};

export const validateUser = async (username, spotifyId) => {
    const user = await findUserBySpotifyId(spotifyId);
    if (!user || user.spotifyId !== spotifyId) {
        return null;
    }

    return user;
};

export const listPublicUsers = async () => {
    const q = query(collection(db, "Users"), where("isPrivate", "==", false));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateUser = async (userId, data) => {
    await updateDoc(doc(db, "Users", userId), data);
};

export const createUser = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, "Users"), userData);

        return docRef;
    } catch (error) {
        console.error("Failed to create new user: ", error);
    }
};
