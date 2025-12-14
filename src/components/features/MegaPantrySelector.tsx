import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, ArrowLeft, Plus, ChevronDown, ChevronUp, ShoppingBasket } from 'lucide-react';
import { categories, ingredients as baseIngredients, type CategoryId } from '../../data/pantryData';
import type { ScenarioId } from '../../data/scenarios';
import { useLanguage } from '../../context/LanguageContext';

interface MegaPantrySelectorProps {
    selectedIngredients: string[];
    onToggleIngredient: (id: string) => void;
    scenario: ScenarioId | null;
    onBack: () => void;
    dietaryPreferences: string[];
}

export function MegaPantrySelector({
    selectedIngredients,
    onToggleIngredient,
    scenario,
    onBack,
    dietaryPreferences
}: MegaPantrySelectorProps) {
    const { t, language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});
    const [customIngredient, setCustomIngredient] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Helper to get localized ingredient name
    const getIngredientName = (ing: typeof baseIngredients[0]) => {
        if (language === 'en' && ing.name_en) {
            return ing.name_en;
        }
        return ing.name;
    };

    // Determine available categories based on scenario
    const availableCategories = useMemo(() => {
        switch (scenario) {
            case 'bar':
                return categories.filter(c => ['alcohol', 'mixers', 'fruits', 'spices', 'nuts', 'snacks'].includes(c.id));
            case 'kitchen':
                return categories.filter(c => ['vegetables', 'fruits', 'protein', 'dairy_cheese', 'grains_legumes', 'baking', 'nuts', 'oils', 'sauces', 'spices', 'canned', 'snacks', 'vegan'].includes(c.id));
            case 'fit':
                return categories.filter(c => ['vegetables', 'fruits', 'protein', 'dairy_cheese', 'grains_legumes', 'nuts', 'vegan', 'spices'].includes(c.id));
            default:
                return categories;
        }
    }, [scenario]);

    // Search Suggestions (Autocomplete)
    const searchSuggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();

        // Search in base ingredients
        const matches = baseIngredients.filter(ing => {
            const name = getIngredientName(ing).toLowerCase();
            return name.includes(query) && !selectedIngredients.includes(ing.id);
        }).slice(0, 5);

        return matches;
    }, [searchQuery, selectedIngredients, language]);

    const handleSearchSelect = (id: string) => {
        onToggleIngredient(id);
        setSearchQuery('');
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    const handleAddCustomIngredient = () => {
        if (!customIngredient.trim()) return;
        // Generate a temporary ID for custom ingredient
        const customId = `custom_${Date.now()}`;
        // Add to baseIngredients temporarily (in a real app, this should be handled better)
        baseIngredients.push({
            id: customId,
            name: customIngredient,
            category: 'pantry_essentials', // Default category
            name_en: customIngredient
        });
        onToggleIngredient(customId);
        setCustomIngredient('');
    };

    const { title } = (() => {
        switch (scenario) {
            case 'bar': return { title: t('create.scenario.bar.title') }; // Using scenario title as proxy
            case 'kitchen': return { title: t('create.scenario.kitchen.title') };
            case 'fit': return { title: t('create.scenario.fit.title') };
            default: return { title: t('create.pantry.title') };
        }
    })();

    // Helper to get ingredients for a category
    // Helper to get ingredients for a category
    const getCategoryIngredients = (categoryId: CategoryId) => {
        let list = baseIngredients.filter(ing => ing.category === categoryId);

        // Filter by scenario
        if (scenario === 'fit') {
            const unhealthyIds = [
                'beyaz_seker', 'esmer_seker', 'pudra_sekeri', 'kola', 'gazoz',
                'cips', 'cikolata', 'biskuvi', 'kraker',
                'somun_ekmek', 'hamburger_ekmegi', 'pizza_hamuru', 'milfoy',
                'bugday_unu', 'spagetti', 'penne', 'fiyonk_makarna', 'burgu_makarna',
                'lazanya', 'eriste', 'noodle',
                'pirinc_baldo', 'pirinc_osmancik', 'pirinc_yasmin', 'risotto_pirinci'
            ];
            list = list.filter(i => !unhealthyIds.includes(i.id));
        }

        // Filter by category search
        const query = categorySearch[categoryId]?.toLowerCase();
        if (query) {
            list = list.filter(ing => getIngredientName(ing).toLowerCase().includes(query));
        }

        // Sort alphabetically
        return list.sort((a, b) => getIngredientName(a).localeCompare(getIngredientName(b), language));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-12rem)]">
            {/* LEFT COLUMN: Main Content */}
            <div className="flex-1 flex flex-col min-h-0">

                {/* Header & Search */}
                <div className="mb-8 space-y-6">
                    <div className="relative flex items-center justify-between h-10">
                        <button
                            onClick={onBack}
                            className="relative z-10 flex items-center space-x-2 text-text/60 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">{t('pantry.back')}</span>
                        </button>
                        <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap">
                            {title}
                        </h2>
                    </div>

                    {/* Hero Search Bar */}
                    <div className="relative z-30">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="w-6 h-6 text-text/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder={t('pantry.search.placeholder')}
                                className="w-full pl-14 pr-4 py-5 bg-surface border border-black/5 dark:border-white/10 rounded-2xl text-lg text-text placeholder:text-text/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-5 flex items-center text-text/40 hover:text-text transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && searchQuery.trim() && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-surface border border-black/5 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-40"
                                >
                                    {searchSuggestions.map((ing) => (
                                        <button
                                            key={ing.id}
                                            onClick={() => handleSearchSelect(ing.id)}
                                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors group border-b border-black/5 dark:border-white/5 last:border-0"
                                        >
                                            <span className="font-medium text-text text-lg">{getIngredientName(ing)}</span>
                                            <Plus className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                    {searchSuggestions.length === 0 && (
                                        <div className="px-6 py-4 text-text/40 text-sm">
                                            {t('pantry.search.no_results')}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Custom Ingredient Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customIngredient}
                        onChange={(e) => setCustomIngredient(e.target.value)}
                        placeholder={t('pantry.custom.placeholder') || "Listede yok mu? Elle ekle..."}
                        className="flex-1 px-4 py-3 bg-surface border border-black/5 dark:border-white/10 rounded-xl text-text placeholder:text-text/40 focus:outline-none focus:border-primary/50 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomIngredient()}
                    />
                    <button
                        onClick={handleAddCustomIngredient}
                        disabled={!customIngredient.trim()}
                        className="px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories Grid (Accordion Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24 lg:pb-0">
                    {availableCategories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        const catIngredients = getCategoryIngredients(cat.id);
                        const selectedCount = catIngredients.filter(i => selectedIngredients.includes(i.id)).length;
                        const catTitle = language === 'tr' ? cat.title.tr : cat.title.en;

                        return (
                            <motion.div
                                key={cat.id}
                                className={`
                                    bg-surface border rounded-2xl overflow-hidden transition-all
                                    ${isActive ? 'border-primary/50 col-span-1 md:col-span-2 shadow-2xl shadow-primary/10' : 'border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}
                                `}
                            >
                                <button
                                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                                    className="w-full relative h-24 md:h-32 flex items-center justify-between px-6 overflow-hidden group"
                                >
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={cat.image || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=800&q=80'}
                                            alt={catTitle}
                                            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
                                    </div>

                                    <div className="relative z-10 flex items-center space-x-4">
                                        <div className="text-left">
                                            <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-primary' : 'text-text'}`}>
                                                {catTitle}
                                            </h3>
                                            <p className="text-sm text-text/60">
                                                {t('pantry.items_count').replace('{count}', catIngredients.length.toString())}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center space-x-4">
                                        {selectedCount > 0 && (
                                            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-lg">
                                                {t('pantry.selected_count').replace('{count}', selectedCount.toString())}
                                            </span>
                                        )}
                                        {isActive ? (
                                            <ChevronUp className="w-6 h-6 text-primary" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-text/40 group-hover:text-text transition-colors" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-black/5 dark:border-white/5 bg-surface/50"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Category Search Input */}
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                                                    <input
                                                        type="text"
                                                        placeholder={`${catTitle} ${t('pantry.search.placeholder').toLowerCase()}...`}
                                                        value={categorySearch[cat.id] || ''}
                                                        onChange={(e) => setCategorySearch(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-lg text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {catIngredients.map((ing) => {
                                                        const isSelected = selectedIngredients.includes(ing.id);
                                                        const isAlcohol = ing.category === 'alcohol';
                                                        const isAlcoholFreeMode = dietaryPreferences.includes('alcohol_free');
                                                        const isDisabled = isAlcohol && isAlcoholFreeMode;

                                                        return (
                                                            <button
                                                                key={ing.id}
                                                                onClick={() => !isDisabled && onToggleIngredient(ing.id)}
                                                                disabled={isDisabled}
                                                                className={`
                                                                relative group flex flex-col items-center p-3 rounded-xl transition-all duration-200
                                                                ${isDisabled
                                                                        ? 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5 grayscale'
                                                                        : isSelected
                                                                            ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/20'
                                                                            : 'bg-surface border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5'
                                                                    }
                                                            `}
                                                            >
                                                                {/* Placeholder Icon/Image */}
                                                                <div className={`
                                                                w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                                                                ${isDisabled
                                                                        ? 'bg-black/10 text-text/20'
                                                                        : isSelected ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 text-text/40 group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:text-text'}
                                                            `}>
                                                                    {isDisabled ? <span className="text-xs">🚫</span> : isSelected ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                                                </div>
                                                                <span className={`text-sm font-medium text-center ${isDisabled ? 'text-text/40 line-through' : isSelected ? 'text-primary' : 'text-text/80'}`}>
                                                                    {getIngredientName(ing)}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT COLUMN: Virtual Pantry (Sticky) */}
            <div className="hidden lg:flex flex-col w-96 pl-4 relative">
                {/* Background Blob for "Different Environment" */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full -z-10" />

                <div className="sticky top-8 h-[calc(100vh-8rem)] flex flex-col bg-surface border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden ml-4">
                    <div className="p-6 border-b border-black/5 dark:border-white/5 bg-surface-light/50 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-text flex items-center gap-2">
                                <ShoppingBasket className="w-5 h-5 text-primary" />
                                {t('pantry.my_pantry')}
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
                                {selectedIngredients.length}
                            </span>
                        </div>
                        <p className="text-xs text-text/40">{t('pantry.my_pantry.desc')}</p>
                    </div>

                    {selectedIngredients.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-text/40 text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Plus className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="font-medium mb-1">{t('pantry.empty.title')}</p>
                            <p className="text-xs opacity-60">{t('pantry.empty.desc')}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {selectedIngredients.map(id => {
                                    const ing = baseIngredients.find(i => i.id === id);
                                    if (!ing) return null;
                                    return (
                                        <motion.div
                                            key={id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-3 bg-surface border border-black/5 dark:border-white/5 rounded-xl group hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                                        >
                                            <span className="text-sm font-medium text-text">{getIngredientName(ing)}</span>
                                            <button
                                                onClick={() => onToggleIngredient(id)}
                                                className="p-1.5 rounded-lg text-text/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Action Button Area */}
                    <div className="p-4 border-t border-black/5 dark:border-white/5 bg-surface-light/30">
                        <button
                            onClick={onBack}
                            className="w-full py-3 rounded-xl border border-black/10 dark:border-white/10 text-text/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-colors text-sm font-medium"
                        >
                            {t('pantry.clear')}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE: Virtual Pantry Drawer (Bottom Sheet) */}
            <AnimatePresence>
                {selectedIngredients.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
                    >
                        <div className="bg-surface/95 backdrop-blur-xl border-t border-black/10 dark:border-white/10 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] p-4 pb-8">
                            <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-4" />

                            <div className="flex items-center justify-between mb-4 px-2">
                                <span className="text-sm font-bold text-text flex items-center gap-2">
                                    <ShoppingBasket className="w-4 h-4 text-primary" />
                                    {t('pantry.mobile.selected').replace('{count}', selectedIngredients.length.toString())}
                                </span>
                                <button
                                    onClick={() => {/* Open full modal maybe? For now just clear/toggle logic could go here */ }}
                                    className="text-xs text-primary font-medium"
                                >
                                    {t('pantry.mobile.view_list')}
                                </button>
                            </div>

                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                {selectedIngredients.map(id => {
                                    const ing = baseIngredients.find(i => i.id === id);
                                    if (!ing) return null;
                                    return (
                                        <motion.button
                                            key={id}
                                            layout
                                            onClick={() => onToggleIngredient(id)}
                                            className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20"
                                        >
                                            <span>{getIngredientName(ing)}</span>
                                            <X className="w-3 h-3 opacity-70" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
