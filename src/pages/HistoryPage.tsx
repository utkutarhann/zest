import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { historyService, type RecipeHistoryItem } from '../services/historyService';
import { RecipeImage } from '../components/ui/RecipeImage';
import { useLanguage } from '../context/LanguageContext';
import bannerCocktail from '../assets/banner-cocktail.jpg';
import bannerFood from '../assets/banner-food.jpg';

export function HistoryPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [history, setHistory] = useState<RecipeHistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<'24h' | '7d'>('24h');

    useEffect(() => {
        setHistory(historyService.getHistory());
    }, []);

    const filteredHistory = history.filter(item => {
        const now = Date.now();
        const diff = now - item.timestamp;
        if (activeTab === '24h') {
            return diff <= 24 * 60 * 60 * 1000;
        } else {
            return diff <= 7 * 24 * 60 * 60 * 1000;
        }
    });

    return (
        <div className="min-h-screen bg-background text-text pt-24 pb-12 px-4 relative">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-24 left-4 md:left-8 p-2 hover:bg-surface rounded-full transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5 z-10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl mx-auto">
                {/* Header - Filters Only */}
                <div className="flex items-center justify-end mb-8 min-h-[40px]">

                    {/* Filters */}
                    {history.length > 0 && (
                        <div className="flex bg-surface border border-black/5 dark:border-white/5 rounded-xl p-1">
                            <button
                                onClick={() => setActiveTab('24h')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === '24h'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text/60 hover:text-text'
                                    }`}
                            >
                                {t('history.24h') || 'Son 24 Saat'}
                            </button>
                            <button
                                onClick={() => setActiveTab('7d')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === '7d'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text/60 hover:text-text'
                                    }`}
                            >
                                {t('history.7d') || 'Son 7 Gün'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {history.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-black/5 dark:border-white/5">
                            <Search className="w-10 h-10 text-text/20" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Henüz bir arama yok</h2>
                        <p className="text-text/60 mb-8 max-w-md">
                            Hemen hayal ettiğim yemeği & kokteyl'i yapalım
                        </p>
                        <Link
                            to="/create"
                            className="group flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                        >
                            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            <span>Yeni Oluştur</span>
                        </Link>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    // Filtered Empty State
                    <div className="text-center py-24 text-text/40 bg-surface/50 rounded-3xl border border-black/5 dark:border-white/5 border-dashed">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{t('history.empty') || 'Bu zaman aralığında tarif bulunamadı.'}</p>
                    </div>
                ) : (
                    // List State
                    <div className="grid gap-4">
                        {filteredHistory.map((recipe) => (
                            <motion.div
                                key={recipe.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-surface border border-black/5 dark:border-white/5 rounded-2xl p-4 flex gap-4 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/5"
                                onClick={() => navigate(`/recipe/${recipe.dishName.toLowerCase().replace(/ /g, '-')}`, { state: recipe })}
                            >
                                {/* Image */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                                    {recipe.scenario ? (
                                        <img
                                            src={recipe.scenario === 'cocktail' ? bannerCocktail : bannerFood}
                                            alt={recipe.dishName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <RecipeImage
                                            term={recipe.imageUrl}
                                            alt={recipe.dishName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-lg sm:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                            {recipe.dishName}
                                        </h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-background rounded-lg border border-black/5 dark:border-white/5 whitespace-nowrap">
                                            {new Date(recipe.timestamp).toLocaleDateString('tr-TR', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <p className="text-sm text-text/60 line-clamp-2 mb-3">
                                        {/* Description is not available in Recipe type yet, using dishName as placeholder or removing */}
                                        {/* {recipe.description} */}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            {recipe.missingCount === 0
                                                ? <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Eksiksiz</span>
                                                : <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">{recipe.missingCount} eksik</span>
                                            }
                                            <span className="text-text/40">•</span>
                                            <span className="text-text/60 flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                {recipe.sourceName}
                                            </span>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
