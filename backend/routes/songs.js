import express from "express";

const router = express.Router();

router.get("/likedsongs", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Access denied: issue with token" });
        }

        const token = authHeader.split(" ")[1];
        const response = await fetch(
            "https://api.spotify.com/v1/me/tracks?limit=50",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                message: "Spotify API error",
                details: errorData,
            });
        }

        const data = await response.json();
        // const data = {
        //     href: "https://api.spotify.com/v1/me/tracks?offset=0&limit=20",
        //     limit: 20,
        //     next: null,
        //     offset: 0,
        //     previous: null,
        //     total: 5,
        //     items: [
        //         {
        //             added_at: "2026-05-20T14:30:00Z",
        //             track: {
        //                 id: "4PTG3Z6ehGkBFm3qLw6b8w",
        //                 name: "Blinding Lights",
        //                 duration_ms: 200040,
        //                 explicit: false,
        //                 album: {
        //                     id: "4aaFm99w06X4YvXptMK9Of",
        //                     name: "After Hours",
        //                     images: [
        //                         {
        //                             url: "https://picsum.photos/300/300",
        //                             height: 300,
        //                             width: 300,
        //                         },
        //                     ],
        //                 },
        //                 artists: [
        //                     {
        //                         id: "1XyoGH6ZytT7b77ehgEwD0",
        //                         name: "The Weeknd",
        //                     },
        //                 ],
        //             },
        //         },
        //         {
        //             added_at: "2026-05-21T09:15:00Z",
        //             track: {
        //                 id: "7ouMYWv34m6Z75Xw6b8w99",
        //                 name: "Starboy",
        //                 duration_ms: 230453,
        //                 explicit: true,
        //                 album: {
        //                     id: "2us3OPMp9Tb4dAKM2erWXQ",
        //                     name: "Starboy",
        //                     images: [
        //                         {
        //                             url: "https://picsum.photos/300/300",
        //                             height: 300,
        //                             width: 300,
        //                         },
        //                     ],
        //                 },
        //                 artists: [
        //                     {
        //                         id: "1XyoGH6ZytT7b77ehgEwD0",
        //                         name: "The Weeknd",
        //                     },
        //                     {
        //                         id: "2Q0w7ZytT7b77ehgEwD01a",
        //                         name: "Daft Punk",
        //                     },
        //                 ],
        //             },
        //         },
        //         {
        //             added_at: "2026-05-22T18:22:00Z",
        //             track: {
        //                 id: "0VjIjW4GlUZAMYv2UP2Zsc",
        //                 name: "Stay",
        //                 duration_ms: 141805,
        //                 explicit: true,
        //                 album: {
        //                     id: "58g79wf6ZytT7b77ehgEwD",
        //                     name: "Stay (with Justin Bieber)",
        //                     images: [
        //                         {
        //                             url: "https://picsum.photos/300/300",
        //                             height: 300,
        //                             width: 300,
        //                         },
        //                     ],
        //                 },
        //                 artists: [
        //                     {
        //                         id: "2tcmDiSbvSIsWv5ut79wf6",
        //                         name: "The Kid LAROI",
        //                     },
        //                     {
        //                         id: "1uNFoZfWee2XrmYXZIDEXw",
        //                         name: "Justin Bieber",
        //                     },
        //                 ],
        //             },
        //         },
        //         {
        //             added_at: "2026-05-23T11:05:00Z",
        //             track: {
        //                 id: "3nVofSIsWv5ut79wf6ZytT",
        //                 name: "Nightcall",
        //                 duration_ms: 258413,
        //                 explicit: false,
        //                 album: {
        //                     id: "1aKj89PzL0XvBc93mY7Xz9",
        //                     name: "Outrun",
        //                     images: [
        //                         {
        //                             url: "https://picsum.photos/300/300",
        //                             height: 300,
        //                             width: 300,
        //                         },
        //                     ],
        //                 },
        //                 artists: [
        //                     {
        //                         id: "0Y67ehgEwD01aKj89PzL0X",
        //                         name: "Kavinsky",
        //                     },
        //                 ],
        //             },
        //         },
        //         {
        //             added_at: "2026-05-24T20:44:00Z",
        //             track: {
        //                 id: "5W79wf6ZytT7b77ehgEwD0",
        //                 name: "Bohemian Rhapsody - 2011 Remaster",
        //                 duration_ms: 354320,
        //                 explicit: false,
        //                 album: {
        //                     id: "6mKj89PzL0XvBc93mY7Xz9",
        //                     name: "A Night At The Opera (2011 Remaster)",
        //                     images: [
        //                         {
        //                             url: "https://picsum.photos/300/300",
        //                             height: 300,
        //                             width: 300,
        //                         },
        //                     ],
        //                 },
        //                 artists: [
        //                     {
        //                         id: "1coDI893mY7Xz9Wv_qL_N2",
        //                         name: "Queen",
        //                     },
        //                 ],
        //             },
        //         },
        //     ],
        // };

        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to fetch liked songs", error);
        res.status(500).json({ message: "Failed to fetch liked songs" });
    }
});

export default router;
