import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, ChefHat, Flame, Check, AlertCircle, ExternalLink, Heart, Share2, Home } from 'lucide-react';
import bannerCocktail from '../assets/banner-cocktail.jpg';
import bannerFood from '../assets/banner-food.jpg';
import { useLanguage } from '../context/LanguageContext';

interface Ingredient {
    name: string;
    amount: string;
    unit?: string;
}

interface Step {
    order: number;
    instruction: string;
    tip?: string;
}

interface RecipeDetail {
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    calories: number;
    sourceUrl?: string;
    ingredients: Ingredient[];
    steps: Step[];
}

export function RecipeDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [detail, setDetail] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Basic info passed from the previous page
    const { dishName, sourceName, sourceUrl, missingIngredients = [], scenario, selectedIngredients = [] } = location.state || {};

    // Determine banner image
    const bannerImage = scenario === 'cocktail' ? bannerCocktail : bannerFood;

    useEffect(() => {
        if (!dishName) {
            navigate('/create');
            return;
        }

        const fetchDetail = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/recipes/detail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dishName, language: 'tr' }),
                });

                if (!response.ok) throw new Error('Failed to fetch details');

                const data = await response.json();
                setDetail(data);
            } catch (err) {
                console.error(err);
                setError('Tarif detayları yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [dishName, navigate]);

    if (!dishName) return null;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-center">
                <div className="w-full max-w-4xl flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold truncate px-4">{dishName}</h1>
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-surface rounded-full transition-colors text-text/80" title={t('recipe.back_home')}>
                            <Home className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-surface rounded-full transition-colors text-text/40 cursor-not-allowed">
                            <Heart className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="pt-16">
                    <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-b-3xl">
                        <img src={bannerImage} alt={dishName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                                <span className="bg-primary/20 px-2 py-1 rounded-md backdrop-blur-sm">{sourceName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 px-4 -mt-8 relative z-10">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-surface rounded-2xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                </div>
                            ))
                        ) : detail ? (
                            <>
                                <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-transform">
                                    <Clock className="w-5 h-5 text-primary mb-1" />
                                    <span className="text-xs text-text/60">Süre</span>
                                    <span className="font-bold">{detail.prepTime + detail.cookTime} dk</span>
                                </div>
                                <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-transform">
                                    <Users className="w-5 h-5 text-secondary mb-1" />
                                    <span className="text-xs text-text/60">Kişi</span>
                                    <span className="font-bold">{detail.servings}</span>
                                </div>
                                <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-transform">
                                    <ChefHat className="w-5 h-5 text-green-400 mb-1" />
                                    <span className="text-xs text-text/60">Zorluk</span>
                                    <span className="font-bold capitalize">{detail.difficulty === 'medium' ? 'Orta' : detail.difficulty === 'hard' ? 'Zor' : 'Kolay'}</span>
                                </div>
                                <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-transform">
                                    <Flame className="w-5 h-5 text-orange-500 mb-1" />
                                    <span className="text-xs text-text/60">Kalori</span>
                                    <span className="font-bold">{detail.calories}</span>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Selected Ingredients Section */}
                    {selectedIngredients.length > 0 && (
                        <div className="px-4 mt-6">
                            <div className="bg-surface/50 border border-white/5 rounded-2xl p-4">
                                <h3 className="text-sm font-bold text-text/60 mb-3 flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {t('recipe.selected_ingredients')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedIngredients.map((ing: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Tabs */}
                <div className="mt-8 px-4">
                    <div className="flex p-1 bg-surface rounded-xl mb-6 relative">
                        <motion.div
                            className="absolute top-1 bottom-1 left-1 bg-primary rounded-lg shadow-lg z-0"
                            initial={false}
                            animate={{
                                x: activeTab === 'ingredients' ? 0 : '100%',
                                width: '50%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        {(['ingredients', 'instructions'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors z-10 relative ${activeTab === tab
                                    ? 'text-white'
                                    : 'text-text/60 hover:text-text'
                                    }`}
                            >
                                {tab === 'ingredients' ? 'Malzemeler' : 'Yapılışı'}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-16 bg-surface border border-white/5 rounded-xl overflow-hidden relative flex items-center px-4">
                                        <div className="w-6 h-6 rounded-full bg-white/5 mr-4" />
                                        <div className="h-4 bg-white/5 rounded w-1/2" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                    </div>
                                ))}
                            </motion.div>
                        ) : error ? (
                            <div className="text-center py-10">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <p className="text-text/80 mb-4">{error}</p>
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-white/10 rounded-xl hover:bg-surface/80"
                                >
                                    <span>Google'da Ara</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ) : detail && activeTab === 'ingredients' ? (
                            <motion.div
                                key="ingredients"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                {detail.ingredients.map((ing, idx) => {
                                    const isMissing = missingIngredients.some((m: string) =>
                                        m.toLowerCase().includes(ing.name.toLowerCase()) ||
                                        ing.name.toLowerCase().includes(m.toLowerCase())
                                    );
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-surface border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isMissing ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'
                                                    }`}>
                                                    {isMissing ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                </div>
                                                <span className={`font-medium ${isMissing ? 'text-text' : 'text-text/60'}`}>
                                                    {ing.name}
                                                </span>
                                            </div>
                                            <span className="text-sm text-text/40 font-medium">
                                                {ing.amount} {ing.unit}
                                            </span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ) : detail && (
                            <motion.div
                                key="instructions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {detail.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-sm mt-1 group-hover:bg-primary group-hover:text-white transition-colors">
                                            {step.order}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-text/90 leading-relaxed">{step.instruction}</p>
                                            {step.tip && (
                                                <div className="bg-secondary/10 border border-secondary/20 p-3 rounded-lg text-sm text-secondary/90 flex gap-2">
                                                    <span className="font-bold">İpucu:</span>
                                                    {step.tip}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="py-8 text-center">
                                    <p className="text-2xl font-bold text-primary">Afiyet Olsun! 🍽️</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 flex justify-center">
                <div className="w-full max-w-4xl flex gap-3">
                    <a
                        href={detail?.sourceUrl || sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        <span>{(detail?.sourceUrl || sourceUrl).includes('google.com') ? "Google'da Ara" : "Tarife Git"}</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                    <button className="w-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center text-text/60 hover:text-text hover:bg-surface/80 transition-colors">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
