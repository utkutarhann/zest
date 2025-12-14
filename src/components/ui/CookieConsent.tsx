import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function CookieConsent() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookieConsent');
        if (consent === null) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-surface/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                                <Cookie className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-text">{t('cookie.title')}</h3>
                                <p className="text-sm text-text/60 leading-relaxed">
                                    {t('cookie.desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-text/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-colors text-sm font-medium whitespace-nowrap"
                            >
                                {t('cookie.decline')}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                {t('cookie.accept')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
