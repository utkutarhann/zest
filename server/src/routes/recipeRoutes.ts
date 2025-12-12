import express from 'express';
import { generateRecipe, generateRecipeDetail } from '../services/aiService';

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { scenario, ingredients, dietaryPreferences, language } = req.body;

    if (!scenario || !ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Missing scenario or ingredients' });
    }

    try {
        const recipe = await generateRecipe(scenario, ingredients, dietaryPreferences, language || 'tr');
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
