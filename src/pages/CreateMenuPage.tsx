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
}

export function CreateMenuPage() {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [step, setStep] = useState<Step>('scenario');
    const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
    const [result, setResult] = useState<RecipeResult | null>(null);

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

    const [loadingFactIndex, setLoadingFactIndex] = useState(0);

    const funFacts = [
        "Domatesin aslında bir meyve olduğunu biliyor muydun? 🍅",
        "Zest senin için binlerce tarifi tarıyor... 🤖",
        "Dünyanın en pahalı baharatı safrandır. 💰",
        "Elindeki malzemelerle harikalar yaratabilirsin! ✨",
        "Bal asla bozulmayan tek yiyecektir. 🍯",
        "Havuçlar eskiden mor renkteydi! 🥕",
        "Muzlar aslında birer bitkidir, ağaç değil. 🍌"
    ];

    useEffect(() => {
        if (step === 'loading') {
            const interval = setInterval(() => {
                setLoadingFactIndex(prev => (prev + 1) % funFacts.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleGenerate = async () => {
        setStep('loading');

        try {
            const response = await fetch('http://localhost:3000/api/recipes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scenario: selectedScenario,
                    ingredients: selectedIngredients,
                    dietaryPreferences,
                    language: language,
                }),
            });

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



                        {/* Sticky Generate Button */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-50">
                            <div className="max-w-4xl mx-auto flex justify-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={selectedIngredients.length === 0}
                                    className="
                                        w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg
                                        hover:bg-primary/90 transition-all hover:scale-105 active:scale-95
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                        flex items-center justify-center space-x-3 shadow-lg shadow-primary/25
                                    "
                                >
                                    <span>{t('create.generate')}</span>
                                    {selectedIngredients.length > 0 && (
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                                            {selectedIngredients.length}
                                        </span>
                                    )}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
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
                                    {funFacts[loadingFactIndex]}
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
                                className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
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
        </div >
    );
}
