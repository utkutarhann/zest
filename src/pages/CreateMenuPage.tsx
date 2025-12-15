import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { ScenarioSelector } from '../components/features/ScenarioSelector';
import { MegaPantrySelector } from '../components/features/MegaPantrySelector';
import { RecipeImage } from '../components/ui/RecipeImage';
import { GoogleAd } from '../components/ui/GoogleAd';
import { useLanguage } from '../context/LanguageContext';
import { historyService } from '../services/historyService';
import { useUser } from '@clerk/clerk-react';
import { LimitReachedModal } from '../components/ui/LimitReachedModal';
import type { ScenarioId } from '../data/scenarios';

type Step = 'scenario' | 'pantry' | 'loading' | 'result';

export interface Recipe {
    dishName: string;
    sourceName: string;
    sourceUrl: string;
    imageUrl: string;
    missingIngredients: string[];
    missingCount: number;
    scenario?: string;
}

interface RecipeResult {
    recipes: Recipe[];
    chefTip?: string;
    contextualSuggestions?: {
        missingIngredient: string;
        suggestedDish: string;
        reason: string;
    }[];
    alternativeIngredients?: {
        missing: string;
        substitute: string;
        usage: string;
    }[];
}

export function CreateMenuPage() {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { user } = useUser();

    // State
    const [step, setStep] = useState<Step>('scenario');
    const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
    const [result, setResult] = useState<RecipeResult | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ count: 0, limit: 2 });
    const [loadingFactIndex, setLoadingFactIndex] = useState(0);
    const [randomFacts, setRandomFacts] = useState<string[]>([]);

    const filters = [
        { id: 'vegetarian', label: 'Vejetaryen', icon: '🌿' },
        { id: 'gluten_free', label: 'Glutensiz', icon: '🌾' },
        { id: 'alcohol_free', label: 'Alkolsüz', icon: '🚫' },
        { id: 'low_calorie', label: 'Düşük Kalori', icon: '🥗' },
    ];

    const toggleFilter = (id: string) => {
        setDietaryPreferences(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleScenarioSelect = (scenario: ScenarioId) => {
        setSelectedScenario(scenario);
        setTimeout(() => setStep('pantry'), 300);
    };

    const toggleIngredient = (ingredientId: string) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredientId)
                ? prev.filter(i => i !== ingredientId)
                : [...prev, ingredientId]
        );
    };

    // Fetch usage stats on mount
    useEffect(() => {
        if (!user?.id) return;

        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${user.id}/usage`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setUsageStats({ count: data.usageCount, limit: data.limit });
                }
            })
            .catch(err => console.error('Failed to fetch usage:', err));
    }, [user?.id]);

    // Loading Facts Logic
    useEffect(() => {
        if (step === 'loading') {
            const keys = [
                'fact.tomato', 'fact.zest', 'fact.saffron', 'fact.magic',
                'fact.honey', 'fact.carrot', 'fact.banana', 'fact.avocado',
                'fact.apple', 'fact.chocolate', 'fact.peanut', 'fact.coffee',
                'fact.pineapple', 'fact.strawberry', 'fact.cucumber'
            ] as const;

            // Fisher-Yates shuffle
            const shuffled = [...keys];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            setRandomFacts(shuffled.map(key => t(key)));

            const interval = setInterval(() => {
                setLoadingFactIndex(prev => (prev + 1) % keys.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [step, t]);

    const handleGenerate = async () => {
        if (!user?.id) return;

        try {
            // Check usage limit first
            const usageResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${user.id}/usage`);
            if (usageResponse.ok) {
                const usageData = await usageResponse.json();
                if (usageData.isLimitReached) {
                    setShowLimitModal(true);
                    return;
                }
            }
        } catch (error) {
            console.error('Usage check failed:', error);
            // Continue to generation even if check fails, let backend handle it
        }

        setStep('loading');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/recipes/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user?.id || '',
                },
                body: JSON.stringify({
                    scenario: selectedScenario,
                    ingredients: selectedIngredients,
                    dietaryPreferences,
                    language: language,
                }),
            });

            if (response.status === 403) {
                const errorData = await response.json();
                if (errorData.code === 'LIMIT_REACHED') {
                    setStep('pantry'); // Go back to pantry view
                    setShowLimitModal(true);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Generation failed');
            }

            const data = await response.json();

            // Enforce sorting on frontend just in case
            if (data.recipes) {
                data.recipes.sort((a: Recipe, b: Recipe) => {
                    const diff = a.missingCount - b.missingCount;
                    if (diff !== 0) return diff;
                    return a.dishName.localeCompare(b.dishName);
                });
            }

            setResult(data);

            // Save to history
            if (data.recipes && data.recipes.length > 0) {
                // Save the first/best match or maybe all? 
                // For now, let's save the top result as a "discovery"
                // Or better, save the search context? 
                // The requirement says "Recipe History", so let's save the top 3 recipes
                data.recipes.slice(0, 3).forEach((recipe: Recipe) => {
                    historyService.addToHistory({ ...recipe, scenario: selectedScenario || undefined });
                });
            }

            setStep('result');
        } catch (error) {
            console.error('Generation Error:', error);
            alert('Bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
            setStep('scenario');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto px-4 py-8">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
                {step !== 'scenario' && step !== 'loading' && (
                    <button
                        onClick={() => setStep(step === 'result' ? 'pantry' : (step === 'pantry' ? 'scenario' : 'pantry'))}
                        className="p-2 hover:bg-surface rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex-1" />
            </div>

            <AnimatePresence mode="wait">
                {step === 'scenario' && (
                    <motion.div
                        key="scenario"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <ScenarioSelector selectedScenario={selectedScenario} onSelect={handleScenarioSelect} />
                    </motion.div>
                )}

                {step === 'pantry' && (
                    <motion.div
                        key="pantry"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8 max-w-4xl mx-auto pb-32"
                    >
                        {/* Quick Filters - Moved to Top */}
                        <div className="space-y-3 bg-surface p-4 rounded-2xl border border-black/5 dark:border-white/5">
                            <p className="text-sm text-text/60 text-center font-medium">{t('create.pantry.subtitle')}</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {filters.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => toggleFilter(filter.id)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium transition-all border
                                            ${dietaryPreferences.includes(filter.id)
                                                ? 'bg-secondary/20 border-secondary text-secondary'
                                                : 'bg-surface border-black/10 dark:border-white/10 text-text/60 hover:border-black/20 dark:hover:border-white/20'
                                            }
                                        `}
                                    >
                                        <span className="mr-2">{filter.icon}</span>
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <MegaPantrySelector
                            selectedIngredients={selectedIngredients}
                            onToggleIngredient={toggleIngredient}
                            scenario={selectedScenario}
                            onBack={() => setStep('scenario')}
                            dietaryPreferences={dietaryPreferences}
                        />



                        {/* Floating CTA Button */}
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 md:px-0 flex flex-col items-center gap-3">
                            {/* Limit Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/80 shadow-lg"
                            >
                                {t('limit.display')
                                    .replace('{current}', (Math.max(0, usageStats.limit - usageStats.count)).toString())
                                    .replace('{max}', usageStats.limit.toString())}
                            </motion.div>

                            <button
                                onClick={handleGenerate}
                                disabled={selectedIngredients.length === 0}
                                className={`
                                    group relative w-full px-8 py-4 
                                    bg-gradient-to-r from-orange-500 to-red-600 
                                    text-white rounded-full font-bold text-xl
                                    shadow-lg shadow-orange-500/40
                                    hover:shadow-orange-500/60 hover:scale-105 hover:-translate-y-1
                                    transition-all duration-300 ease-out
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:translate-y-0
                                    flex items-center justify-center space-x-3
                                `}
                            >
                                <span className="relative z-10 text-shadow-sm">{t('create.generate')}</span>
                                {selectedIngredients.length > 0 && (
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md">
                                        {selectedIngredients.length}
                                    </span>
                                )}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 space-y-8 max-w-2xl mx-auto w-full"
                    >
                        {/* Loading Animation */}
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-surface rounded-full" />
                            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                        </div>

                        {/* Fun Fact */}
                        <div className="text-center space-y-2 h-20">
                            <p className="text-sm text-primary font-bold uppercase tracking-wider">Biliyor muydun?</p>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={loadingFactIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-medium text-text"
                                >
                                    {randomFacts[loadingFactIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Skeleton Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full opacity-50">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-surface border border-white/5 rounded-2xl overflow-hidden h-64 flex flex-col">
                                    <div className="h-32 bg-white/5 animate-pulse" />
                                    <div className="p-4 space-y-3 flex-1">
                                        <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
                                        <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                                {t('create.results.title')}
                            </h2>
                            <p className="text-text/60">
                                {t('create.results.desc').replace('{count}', result.recipes.length.toString())}
                            </p>
                        </div>

                        {/* Chef's Tip Section */}
                        {result.chefTip && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                                        <span className="text-2xl">👨‍🍳</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            {t('create.results.chef_tip') || "Şefin Tavsiyesi"}
                                        </h3>
                                        <p className="text-text/80 italic leading-relaxed">
                                            "{result.chefTip}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Smart Suggestions Section */}
                        {(result.contextualSuggestions?.length || 0) > 0 && (
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {result.contextualSuggestions?.map((suggestion, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="bg-surface border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span className="text-4xl">🔓</span>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 text-amber-500">
                                                <span className="text-xl">💡</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-text mb-1">
                                                    {suggestion.missingIngredient} ekle, {suggestion.suggestedDish} yap!
                                                </h4>
                                                <p className="text-sm text-text/60 leading-relaxed">
                                                    {suggestion.reason}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Alternative Ingredients Section */}
                        {(result.alternativeIngredients?.length || 0) > 0 && (
                            <div className="mb-12">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="text-xl">🔄</span>
                                    Akıllı Değişimler
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {result.alternativeIngredients?.map((alt, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + (0.1 * idx) }}
                                            className="bg-surface border border-blue-500/20 rounded-xl p-4 hover:bg-blue-500/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                                                <span className="text-red-400 line-through decoration-red-400/50">{alt.missing}</span>
                                                <ArrowRight className="w-4 h-4 text-text/40" />
                                                <span className="text-blue-500">{alt.substitute}</span>
                                            </div>
                                            <p className="text-xs text-text/60">
                                                {alt.usage}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {result.recipes.map((recipe, index) => (
                                <Fragment key={index}>
                                    <motion.div
                                        onClick={() => navigate(`/recipe/${recipe.dishName.toLowerCase().replace(/ /g, '-')}`, { state: { ...recipe, scenario: selectedScenario, selectedIngredients } })}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col cursor-pointer"
                                    >
                                        {/* Image Placeholder */}
                                        <div className="h-48 bg-surface-light relative overflow-hidden">
                                            <RecipeImage
                                                term={recipe.imageUrl}
                                                alt={recipe.dishName}
                                                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 z-20">
                                                <ExternalLink className="w-3 h-3" />
                                                {recipe.sourceName}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                                                {recipe.dishName}
                                            </h3>

                                            <div className="mt-auto pt-4 border-t border-white/5">
                                                {recipe.missingCount === 0 ? (
                                                    <div className="flex items-center text-green-500 text-sm font-bold gap-2 bg-green-500/10 px-3 py-2 rounded-lg">
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span>{t('create.results.missing_none')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className={`
                                                            flex items-center text-sm font-bold gap-2 px-3 py-2 rounded-lg
                                                            ${recipe.missingCount <= 2 ? 'text-yellow-600 bg-yellow-500/10' : 'text-red-500 bg-red-500/10'}
                                                        `}>
                                                            <AlertCircle className="w-5 h-5" />
                                                            <span>{t('create.results.missing_some').replace('{count}', recipe.missingCount.toString())}</span>
                                                        </div>
                                                        <p className="text-xs text-text/60 pl-1">
                                                            <span className="font-semibold">Eksikler:</span> {recipe.missingIngredients.join(', ')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Insert Ad every 3 items */}
                                    {(index + 1) % 3 === 0 && (
                                        <div className="col-span-1 md:col-span-2 lg:col-span-3 my-4">
                                            <GoogleAd slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_FEED || ''} className="w-full h-32" />
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setStep('pantry')}
                                className="px-8 py-3 bg-surface border border-white/10 text-text rounded-xl hover:bg-surface/80 transition-colors font-medium"
                            >
                                {t('create.results.edit')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LimitReachedModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
            />
        </div >
    );
}
