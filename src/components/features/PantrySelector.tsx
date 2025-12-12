import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface Ingredient {
    id: string;
    name: string;
    category: 'protein' | 'veggie' | 'carb' | 'drink';
}

interface PantrySelectorProps {
    selectedIngredients: string[];
    onToggleIngredient: (ingredient: string) => void;
}

// Mock Data - In a real app this could come from an API or be more extensive
const INGREDIENTS: Ingredient[] = [
    { id: 'chicken', name: 'Tavuk', category: 'protein' },
    { id: 'beef', name: 'Kıyma/Et', category: 'protein' },
    { id: 'eggs', name: 'Yumurta', category: 'protein' },
    { id: 'cheese', name: 'Peynir', category: 'protein' },
    { id: 'tomato', name: 'Domates', category: 'veggie' },
    { id: 'onion', name: 'Soğan', category: 'veggie' },
    { id: 'potato', name: 'Patates', category: 'veggie' },
    { id: 'pasta', name: 'Makarna', category: 'carb' },
    { id: 'rice', name: 'Pirinç', category: 'carb' },
    { id: 'bread', name: 'Ekmek', category: 'carb' },
    { id: 'milk', name: 'Süt', category: 'drink' },
    { id: 'soda', name: 'Soda', category: 'drink' },
    { id: 'lemon', name: 'Limon', category: 'veggie' },
];

export function PantrySelector({ selectedIngredients, onToggleIngredient }: PantrySelectorProps) {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<Ingredient['category']>('protein');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'protein', label: t('pantry.category.protein') },
        { id: 'veggie', label: t('pantry.category.veggie') },
        { id: 'carb', label: t('pantry.category.carb') },
        { id: 'drink', label: t('pantry.category.drink') },
    ] as const;

    const filteredIngredients = INGREDIENTS.filter(ing =>
        (activeCategory === ing.category || searchQuery.length > 0) &&
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">{t('pantry.title')}</h2>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
                <input
                    type="text"
                    placeholder={t('pantry.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-4 h-4 text-text/60" />
                    </button>
                )}
            </div>

            {/* Categories (Only show if not searching) */}
            {!searchQuery && (
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as any)}
                            className={`
                px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium
                ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'bg-surface text-text/60 hover:text-text hover:bg-surface/80'
                                }
              `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Ingredients Grid */}
            <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="popLayout">
                    {filteredIngredients.map((ing) => {
                        const isSelected = selectedIngredients.includes(ing.name);
                        return (
                            <motion.button
                                key={ing.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => onToggleIngredient(ing.name)}
                                className={`
                  px-4 py-2 rounded-xl border transition-all duration-200
                  ${isSelected
                                        ? 'bg-secondary text-background border-secondary font-semibold shadow-md shadow-secondary/20'
                                        : 'bg-transparent border-white/10 text-text/80 hover:border-primary/50'
                                    }
                `}
                            >
                                {ing.name}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
