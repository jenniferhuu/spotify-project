import { Router } from "express";
import {
    getForums,
    searchForumsHandler,
    postForum,
    getThreads,
    searchThreadsHandler,
    postThread,
    getThreadDetail,
    postReply,
} from "../controllers/forumsController.js";

const router = Router();

//Forums
router.get("/", getForums);
router.get("/search", searchForumsHandler);
router.post("/", postForum);

//Threads
router.get("/:forumId/threads", getThreads);
router.get("/:forumId/threads/search", searchThreadsHandler);
router.post("/:forumId/threads", postThread);

// Thread detail + replies
router.get("/:forumId/threads/:threadId", getThreadDetail);
router.post("/:forumId/threads/:threadId/replies", postReply);
export default router;

//search routes (/search and /:forumId/threads/search) must be defined before the param routes (/:forumId and /:forumId/threads/:threadId). 
//If they were after, Express would treat the word "search" as a forumId or threadId and hit the wrong handler. 