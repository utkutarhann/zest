import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { historyService, type RecipeHistoryItem } from '../../services/historyService';
import { RecipeImage } from '../ui/RecipeImage';
import { useLanguage } from '../../context/LanguageContext';

export function RecipeHistory() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [history, setHistory] = useState<RecipeHistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<'24h' | '7d'>('24h');

    useEffect(() => {
        setHistory(historyService.getHistory());
    }, []);

    // if (history.length === 0) return null; // Removed to show empty state

    const filteredHistory = history.filter(item => {
        const now = Date.now();
        const diff = now - item.timestamp;
        if (activeTab === '24h') {
            return diff <= 24 * 60 * 60 * 1000;
        } else {
            return diff <= 7 * 24 * 60 * 60 * 1000;
        }
    });

    if (filteredHistory.length === 0 && activeTab === '24h' && history.length > 0) {
        // If no items in 24h but items exist, switch to 7d automatically or just show empty state for tab
        // Let's just keep it empty for now or maybe auto-switch?
        // Better to let user switch.
    }

    return (
        <div className="py-12 border-b border-black/5 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-1">{t('history.title') || 'Geçmiş Tarifler'}</h2>
                        <p className="text-text/60 text-sm">{t('history.subtitle') || 'Daha önce keşfettiğin lezzetler'}</p>
                    </div>

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
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center py-12 text-text/40 bg-surface/50 rounded-3xl border border-black/5 dark:border-white/5 border-dashed">
                        <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p>{t('history.empty') || 'Bu zaman aralığında tarif bulunamadı.'}</p>
                    </div>
                ) : (
                    <div className="relative group">
                        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 no-scrollbar snap-x">
                            {filteredHistory.map((recipe) => (
                                <motion.div
                                    key={recipe.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex-shrink-0 w-72 snap-start"
                                >
                                    <div
                                        onClick={() => navigate(`/recipe/${recipe.dishName.toLowerCase().replace(/ /g, '-')}`, { state: recipe })}
                                        className="bg-surface border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer h-full flex flex-col group/card"
                                    >
                                        <div className="h-40 relative overflow-hidden">
                                            <RecipeImage
                                                term={recipe.imageUrl}
                                                alt={recipe.dishName}
                                                className="w-full h-full group-hover/card:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-medium text-white flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                {recipe.sourceName}
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover/card:text-primary transition-colors">
                                                {recipe.dishName}
                                            </h3>
                                            <p className="text-xs text-text/60 mb-3">
                                                {new Date(recipe.timestamp).toLocaleDateString('tr-TR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
                                                <span className="text-xs font-medium text-text/60">
                                                    {recipe.missingCount === 0
                                                        ? <span className="text-green-500">Eksiksiz</span>
                                                        : <span className="text-orange-500">{recipe.missingCount} eksik</span>
                                                    }
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover/card:bg-primary group-hover/card:text-white transition-colors">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Fade gradients for scroll indication */}
                        <div className="absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                        <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                    </div>
                )}
            </div>
        </div>
    );
}
