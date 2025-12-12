import express from 'express';
import { query } from '../db';

const router = express.Router();

// Middleware to check if user is admin
// Note: In a real app, you'd verify the session/token here.
// For now, we'll trust the client to send the user ID and check the DB.
const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const result = await query('SELECT role FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Dashboard Stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
        const activeTodayResult = await query('SELECT COUNT(*) as count FROM users WHERE last_usage_date = CURRENT_DATE');
        const totalUsageResult = await query('SELECT SUM(daily_usage_count) as count FROM users');

        res.json({
            totalUsers: parseInt(totalUsersResult.rows[0].count),
            activeToday: parseInt(activeTodayResult.rows[0].count),
            totalUsage: parseInt(totalUsageResult.rows[0].count || '0')
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Users List
router.get('/users', isAdmin, async (req, res) => {
    try {
        const result = await query('SELECT id, email, role, daily_usage_count, last_usage_date FROM users ORDER BY last_usage_date DESC LIMIT 100');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
