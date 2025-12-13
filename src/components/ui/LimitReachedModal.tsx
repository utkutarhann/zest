import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LimitReachedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
    const { t } = useLanguage();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-surface border border-white/10 rounded-3xl shadow-2xl z-50"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-text/40 hover:text-text hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4 pt-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                <Clock className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold text-text">
                                {t('limit.title')}
                            </h3>

                            <p className="text-text/60 leading-relaxed">
                                {t('limit.desc')}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors mt-4"
                            >
                                {t('limit.button')}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
