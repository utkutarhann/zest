import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart, Target, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCookieConsent, defaultConsent, type CookieConsentState } from '../../context/CookieContext';

export function CookieConsent() {
    const { t } = useLanguage();
    const { showBanner, acceptAll, rejectAll, saveConsent, consent } = useCookieConsent();
    const [showModal, setShowModal] = useState(false);

    // Local state for the modal toggles
    const [preferences, setPreferences] = useState<CookieConsentState>(defaultConsent);

    // Sync preferences with current consent when modal opens
    useEffect(() => {
        if (showModal && consent) {
            setPreferences(consent);
        } else if (showModal) {
            setPreferences(defaultConsent);
        }
    }, [showModal, consent]);

    const handleSavePreferences = () => {
        saveConsent(preferences);
        setShowModal(false);
    };

    const togglePreference = (key: keyof CookieConsentState) => {
        if (key === 'essential') return; // Cannot toggle essential
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (!showBanner && !showModal) return null;

    return (
        <AnimatePresence>
            {/* Banner */}
            {showBanner && !showModal && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-surface/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-xl shrink-0 hidden sm:block">
                                <Cookie className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-text flex items-center gap-2">
                                    <Cookie className="w-5 h-5 text-primary sm:hidden" />
                                    {t('cookie.title')}
                                </h3>
                                <p className="text-sm text-text/60 leading-relaxed max-w-3xl">
                                    {t('cookie.desc')}
                                </p>
                                <div className="flex gap-4 text-xs text-primary font-medium pt-1">
                                    <a href="#" className="hover:underline">{t('cookie.policy')}</a>
                                    <a href="#" className="hover:underline">{t('cookie.privacy')}</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-colors text-sm font-medium whitespace-nowrap"
                            >
                                {t('cookie.manage')}
                            </button>
                            <button
                                onClick={rejectAll}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-colors text-sm font-medium whitespace-nowrap"
                            >
                                {t('cookie.reject_all')}
                            </button>
                            <button
                                onClick={acceptAll}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                {t('cookie.accept_all')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Modal */}
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-2xl bg-surface border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-light/50">
                            <div className="flex items-center gap-3">
                                <Settings className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-text">{t('cookie.manage')}</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text/40 hover:text-text transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <p className="text-sm text-text/60">
                                {t('cookie.desc')}
                            </p>

                            {/* Essential */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <div className="p-2 bg-surface rounded-lg shrink-0">
                                    <Shield className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-text">{t('cookie.cat.essential.title')}</h4>
                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">ALWAYS ACTIVE</span>
                                    </div>
                                    <p className="text-xs text-text/60 leading-relaxed">
                                        {t('cookie.cat.essential.desc')}
                                    </p>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10">
                                <div className="p-2 bg-surface rounded-lg shrink-0">
                                    <BarChart className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-text">{t('cookie.cat.analytics.title')}</h4>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={preferences.analytics}
                                                onChange={() => togglePreference('analytics')}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <p className="text-xs text-text/60 leading-relaxed">
                                        {t('cookie.cat.analytics.desc')}
                                    </p>
                                </div>
                            </div>

                            {/* Marketing */}
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10">
                                <div className="p-2 bg-surface rounded-lg shrink-0">
                                    <Target className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-text">{t('cookie.cat.marketing.title')}</h4>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={preferences.marketing}
                                                onChange={() => togglePreference('marketing')}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <p className="text-xs text-text/60 leading-relaxed">
                                        {t('cookie.cat.marketing.desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-black/5 dark:border-white/5 bg-surface-light/30 flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button
                                onClick={acceptAll}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-text/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text transition-colors text-sm font-medium"
                            >
                                {t('cookie.accept_all')}
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold shadow-lg shadow-primary/20"
                            >
                                {t('cookie.save')}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
