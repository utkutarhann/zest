import express from 'express';
import { query } from '../db';
import { z } from 'zod';

const router = express.Router();

// Validation Schema
const syncUserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
    email: z.string().email('Invalid email format'),
});

// Sync User Endpoint
router.post('/sync', async (req, res) => {
    try {
        // Validate input
        const { id, email } = syncUserSchema.parse(req.body);

        // Check if user exists
        const checkRes = await query('SELECT * FROM users WHERE id = $1', [id]);

        if (checkRes.rows.length === 0) {
            // Create new user
            const role = email === 'utkutarhann@gmail.com' ? 'admin' : 'user';
            await query('INSERT INTO users (id, email, role) VALUES ($1, $2, $3)', [id, email, role]);
            console.log(`New user created: ${email} with role ${role}`);
        } else {
            // Update last usage
            // Also ensure admin rights if email matches (in case they were created before this change)
            if (email === 'utkutarhann@gmail.com') {
                await query('UPDATE users SET last_usage_date = CURRENT_DATE, role = $1 WHERE id = $2', ['admin', id]);
            } else {
                await query('UPDATE users SET last_usage_date = CURRENT_DATE WHERE id = $1', [id]);
            }
        }

        res.status(200).json({ success: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: (err as z.ZodError).errors[0]?.message || 'Invalid input' });
        }
        console.error('Error syncing user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
