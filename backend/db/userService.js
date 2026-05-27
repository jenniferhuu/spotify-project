import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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

export const createUser = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, "Users"), userData);

        return docRef;
    } catch (error) {
        console.error("Failed to create new user: ", error);
    }
};
