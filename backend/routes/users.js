import { Router } from "express";
import { listPublicUsers } from "../db/userService.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await listPublicUsers();
        res.json({ users });
    } catch (err) {
        console.error("Error listing users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
