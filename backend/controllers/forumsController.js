import * as forumsService from "../services/forumsService.js";

// forums

export async function getForums(req, res) {
    try {
        const forums = await forumsService.listForums();
        res.json(forums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export async function searchForumsHandler(req, res) {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Missing search query" });
        const forums = await forumsService.searchForums(q);
        res.json(forums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export async function postForum(req, res) {
    try {
        const { title, description, createdBy, createdByName } = req.body;
        if (!title || !createdBy || !createdByName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await forumsService.createForum({ title, description, createdBy, createdByName });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteForumHandler(req, res) {
    try {
        const { forumId } = req.params;
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        const forums = await forumsService.listForums();
        const forum = forums.find(f => f.id === forumId);
        if (!forum) return res.status(404).json({ error: "Forum not found" });
        if (forum.createdBy !== userId) return res.status(403).json({ error: "Not authorized to delete this forum" });

        await forumsService.deleteForum(forumId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//Threads


export async function getThreads(req, res) {
    try {
        const { forumId } = req.params;
        const threads = await forumsService.listThreads(forumId);
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function searchThreadsHandler(req, res) {
    try {
        const { forumId } = req.params;
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Missing search query" });
        const threads = await forumsService.searchThreads(forumId, q);
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function postThread(req, res) {
    try {
        const { forumId } = req.params;
        const { title, body, authorID, authorName } = req.body;
        if (!title || !body || !authorID || !authorName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await forumsService.createThread(forumId, { title, body, authorID, authorName });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getThreadDetail(req, res) {
    try {
        const { forumId, threadId } = req.params;
        const [thread, replies] = await Promise.all([
            forumsService.getThread(forumId, threadId),
            forumsService.listReplies(forumId, threadId),
        ]);
        res.json({ ...thread, repliesList: replies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteThreadHandler(req, res) {
    try {
        const { forumId, threadId } = req.params;
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        const thread = await forumsService.getThread(forumId, threadId);
        if (!thread) return res.status(404).json({ error: "Thread not found" });
        if (thread.authorID !== userId) return res.status(403).json({ error: "Not authorized to delete this thread" });

        await forumsService.deleteThread(forumId, threadId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//replies

export async function deleteReplyHandler(req, res) {
    try {
        const { forumId, threadId, replyId } = req.params;
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        const reply = await forumsService.getReply(forumId, threadId, replyId);
        if (!reply) return res.status(404).json({ error: "Reply not found" });
        if (reply.authorID !== userId) return res.status(403).json({ error: "Not authorized to delete this reply" });

        await forumsService.deleteReply(forumId, threadId, replyId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function postReply(req, res) {
    try {
        const { forumId, threadId } = req.params;
        const { body, authorID, authorName } = req.body;
        if (!body || !authorID || !authorName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await forumsService.createReply(forumId, threadId, { body, authorID, authorName });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}