const BASE = '/api/forums';

export async function fetchForums() {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch forums');
    return res.json();
}

export async function searchForums(q) {
    const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Failed to search forums');
    return res.json();
}

export async function createForum(data) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create forum');
    return res.json();
}

export async function fetchThreads(forumId) {
    const res = await fetch(`${BASE}/${forumId}/threads`);
    if (!res.ok) throw new Error('Failed to fetch threads');
    return res.json();
}

export async function searchThreads(forumId, q) {
    const res = await fetch(`${BASE}/${forumId}/threads/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Failed to search threads');
    return res.json();
}

export async function createThread(forumId, data) {
    const res = await fetch(`${BASE}/${forumId}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create thread');
    return res.json();
}

export async function fetchThreadDetail(forumId, threadId) {
    const res = await fetch(`${BASE}/${forumId}/threads/${threadId}`);
    if (!res.ok) throw new Error('Failed to fetch thread');
    return res.json();
}

export async function createReply(forumId, threadId, data) {
    const res = await fetch(`${BASE}/${forumId}/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to post reply');
    return res.json();
}