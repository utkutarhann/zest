import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LimitReachedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
    const { t } = useLanguage();

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modern Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md p-8 bg-[#1A1A1A] border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center text-center overflow-hidden"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-text/40 hover:text-text hover:bg-white/5 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon Container with Glow */}
                        <div className="relative mb-6 mt-2">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <div className="relative w-24 h-24 bg-surface-light border border-white/5 rounded-full flex items-center justify-center text-4xl shadow-inner">
                                👨‍🍳
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-text mb-3 relative z-10">
                            {t('limit.title')}
                        </h3>

                        <p className="text-text/60 leading-relaxed mb-8 max-w-sm relative z-10">
                            {t('limit.desc')}
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 relative z-10"
                        >
                            {t('limit.button')}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
