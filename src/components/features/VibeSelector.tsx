import { motion } from 'framer-motion';
import { Heart, PartyPopper, Zap, Crown, Leaf, Armchair } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type VibeType = 'romantic' | 'friends' | 'quick' | 'treat' | 'healthy' | 'comfort';

interface VibeSelectorProps {
    selectedVibe: VibeType | null;
    onSelect: (vibe: VibeType) => void;
}

export function VibeSelector({ selectedVibe, onSelect }: VibeSelectorProps) {
    const { t } = useLanguage();

    const vibes = [
        { id: 'romantic', icon: Heart, color: 'from-pink-500 to-rose-500', label: t('vibe.romantic') },
        { id: 'friends', icon: PartyPopper, color: 'from-purple-500 to-indigo-500', label: t('vibe.friends') },
        { id: 'quick', icon: Zap, color: 'from-yellow-400 to-orange-500', label: t('vibe.quick') },
        { id: 'treat', icon: Crown, color: 'from-amber-200 to-yellow-400', label: t('vibe.treat') },
        { id: 'healthy', icon: Leaf, color: 'from-green-400 to-emerald-600', label: t('vibe.healthy') },
        { id: 'comfort', icon: Armchair, color: 'from-blue-400 to-cyan-500', label: t('vibe.comfort') },
    ] as const;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">{t('vibe.title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vibes.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;
                    return (
                        <motion.button
                            key={vibe.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(vibe.id as VibeType)}
                            className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 h-40
                ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                                    : 'border-white/10 bg-surface hover:border-primary/50'
                                }
              `}
                        >
                            <div className={`
                p-3 rounded-full bg-gradient-to-br ${vibe.color} text-white
                ${isSelected ? 'scale-110' : 'scale-100'} transition-transform duration-300
              `}>
                                <vibe.icon className="w-6 h-6" />
                            </div>
                            <span className={`font-medium ${isSelected ? 'text-primary' : 'text-text/80'}`}>
                                {vibe.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
