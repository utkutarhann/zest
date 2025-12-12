import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { query } from './db';

import recipeRoutes from './routes/recipeRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Endpoint
app.post('/api/users/sync', async (req, res) => {
    const { id, email } = req.body;

    if (!id || !email) {
        return res.status(400).json({ error: 'Missing user ID or email' });
    }

    try {
        // Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE id = $1', [id]);

        if (userCheck.rows.length === 0) {
            // Create new user
            await query(
                'INSERT INTO users (id, email, daily_usage_count, last_usage_date) VALUES ($1, $2, 0, NOW())',
                [id, email]
            );
        } else {
            // Reset daily limit if it's a new day
            const user = userCheck.rows[0];
            const lastDate = new Date(user.last_usage_date).toDateString();
            const today = new Date().toDateString();

            if (lastDate !== today) {
                await query('UPDATE users SET daily_usage_count = 0, last_usage_date = NOW() WHERE id = $1', [id]);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
