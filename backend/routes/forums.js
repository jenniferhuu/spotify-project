import { Router } from "express";
import {
    getForums,
    searchForumsHandler,
    postForum,
    deleteForumHandler,
    getThreads,
    searchThreadsHandler,
    postThread,
    deleteThreadHandler,
    getThreadDetail,
    postReply,
    deleteReplyHandler,
    toggleForumLikeHandler,
    toggleThreadLikeHandler,
    toggleReplyLikeHandler,
} from "../controllers/forumsController.js";

const router = Router();

//Forums
router.get("/", getForums);
router.get("/search", searchForumsHandler);
router.post("/", postForum);
router.delete("/:forumId", deleteForumHandler);

//Threads
router.get("/:forumId/threads", getThreads);
router.get("/:forumId/threads/search", searchThreadsHandler);
router.post("/:forumId/threads", postThread);

router.delete("/:forumId/threads/:threadId", deleteThreadHandler);

// Thread detail + replies
router.get("/:forumId/threads/:threadId", getThreadDetail);
router.post("/:forumId/threads/:threadId/replies", postReply);
router.delete("/:forumId/threads/:threadId/replies/:replyId", deleteReplyHandler);

// Likes
router.post("/:forumId/like", toggleForumLikeHandler);
router.post("/:forumId/threads/:threadId/like", toggleThreadLikeHandler);
router.post("/:forumId/threads/:threadId/replies/:replyId/like", toggleReplyLikeHandler);

export default router;

//search routes (/search and /:forumId/threads/search) must be defined before the param routes (/:forumId and /:forumId/threads/:threadId). 
//If they were after, Express would treat the word "search" as a forumId or threadId and hit the wrong handler. 