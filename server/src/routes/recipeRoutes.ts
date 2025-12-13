import express from 'express';
import { generateRecipe, generateRecipeDetail } from '../services/aiService';
import { query } from '../db';

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { scenario, ingredients, dietaryPreferences, language } = req.body;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
    }

    if (!scenario || !ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Missing scenario or ingredients' });
    }

    try {
        // Check user limits
        const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);

        if (userRes.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userRes.rows[0];
        const today = new Date().toISOString().split('T')[0];
        const lastUsage = user.last_usage_date ? new Date(user.last_usage_date).toISOString().split('T')[0] : null;

        let currentCount = user.daily_usage_count;

        // Reset count if new day
        if (lastUsage !== today) {
            currentCount = 0;
            await query('UPDATE users SET daily_usage_count = 0, last_usage_date = CURRENT_DATE WHERE id = $1', [userId]);
        }

        // Check limit (Max 2)
        if (currentCount >= 2) {
            return res.status(403).json({
                error: 'Daily limit reached',
                code: 'LIMIT_REACHED',
                message: language === 'tr' ? 'Günlük 2 tarif hakkınız doldu. Yarın tekrar bekleriz!' : 'You have reached your daily limit of 2 recipes. See you tomorrow!'
            });
        }

        const recipe = await generateRecipe(scenario, ingredients, dietaryPreferences, language || 'tr');

        // Increment usage count
        await query('UPDATE users SET daily_usage_count = daily_usage_count + 1, last_usage_date = CURRENT_DATE WHERE id = $1', [userId]);

        res.json(recipe);
    } catch (error: any) {
        console.error('AI Generation Error:', error);
        if (error.message === 'OpenAI API Key is missing') {
            return res.status(503).json({ error: 'AI Service Unavailable (Missing Key)' });
        }
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
});

router.post('/detail', async (req, res) => {
    const { dishName, language } = req.body;

    if (!dishName) {
        return res.status(400).json({ error: 'Missing dishName' });
    }

    try {
        const detail = await generateRecipeDetail(dishName, language || 'tr');
        res.json(detail);
    } catch (error: any) {
        console.error('AI Detail Generation Error:', error);
        if (error.message === 'OpenAI API Key is missing') {
            return res.status(503).json({ error: 'AI Service Unavailable (Missing Key)' });
        }
        res.status(500).json({ error: 'Failed to generate recipe detail' });
    }
});

export default router;
