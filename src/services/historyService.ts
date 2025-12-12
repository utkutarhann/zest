import type { Recipe } from '../pages/CreateMenuPage';

export interface RecipeHistoryItem extends Recipe {
    timestamp: number;
    id: string; // Unique ID for the history item
}

const STORAGE_KEY = 'zest_recipe_history';
const MAX_HISTORY_ITEMS = 50;

export const historyService = {
    addToHistory: (recipe: Recipe) => {
        try {
            const history = historyService.getHistory();

            // Create a new item
            const newItem: RecipeHistoryItem = {
                ...recipe,
                timestamp: Date.now(),
                id: crypto.randomUUID()
            };

            // Add to beginning, limit to MAX items
            const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    },

    getHistory: (): RecipeHistoryItem[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return [];
            return JSON.parse(stored);
        } catch (error) {
            console.error('Failed to read history:', error);
            return [];
        }
    },

    clearHistory: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
