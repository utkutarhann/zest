import { ArrowRight, Sparkles, Refrigerator, ChefHat, ArrowDown, Instagram, Twitter, Github } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleAd } from '../components/ui/GoogleAd';
import { useLanguage } from '../context/LanguageContext';


export function LandingPage() {
    const { t } = useLanguage();

    const scrollToHowItWorks = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-surface border border-black/5 dark:border-white/10 text-sm text-secondary mb-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>{t('landing.badge')}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight"
                    >
                        {t('landing.title.prefix')} <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {t('landing.title.suffix')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-text/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('landing.description')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <SignedIn>
                            <Link
                                to="/create"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
                            >
                                <span>{t('landing.cta')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
                            >
                                <span>{t('landing.cta')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </SignedOut>

                        <button
                            onClick={scrollToHowItWorks}
                            className="w-full sm:w-auto px-8 py-4 bg-surface border border-black/5 dark:border-white/10 text-text rounded-2xl font-semibold text-lg hover:bg-surface/80 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>{t('landing.secondaryCta')}</span>
                            <ArrowDown className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </div>



            {/* How It Works Section */}
            <div id="how-it-works" className="py-24 bg-surface/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.howItWorks.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-surface border border-black/5 dark:border-white/5 p-8 rounded-3xl text-center relative group hover:border-primary/20 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Refrigerator className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('landing.howItWorks.step1.title')}</h3>
                                <p className="text-text/60 leading-relaxed">{t('landing.howItWorks.step1.desc')}</p>
                            </div>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-surface border border-black/5 dark:border-white/5 p-8 rounded-3xl text-center relative group hover:border-secondary/20 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-secondary/5 h-full flex flex-col items-center">
                                <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('landing.howItWorks.step2.title')}</h3>
                                <p className="text-text/60 leading-relaxed">{t('landing.howItWorks.step2.desc')}</p>
                            </div>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-surface border border-black/5 dark:border-white/5 p-8 rounded-3xl text-center relative group hover:border-green-400/20 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-green-400/5 h-full flex flex-col items-center">
                                <div className="w-20 h-20 bg-green-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ChefHat className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{t('landing.howItWorks.step3.title')}</h3>
                                <p className="text-text/60 leading-relaxed">{t('landing.howItWorks.step3.desc')}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.features.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-surface border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:border-primary/20 transition-all hover:-translate-y-1 group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ChefHat className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('landing.features.kitchen')}</h3>
                        </div>

                        <div className="bg-surface border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:border-secondary/20 transition-all hover:-translate-y-1 group">
                            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('landing.features.bar')}</h3>
                        </div>

                        <div className="bg-surface border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:border-green-400/20 transition-all hover:-translate-y-1 group">
                            <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Refrigerator className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('landing.features.fit')}</h3>
                        </div>

                        <div className="bg-surface border border-black/5 dark:border-white/5 p-6 rounded-3xl hover:border-orange-400/20 transition-all hover:-translate-y-1 group">
                            <div className="w-12 h-12 bg-orange-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('landing.features.menu')}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Section */}
            <div className="max-w-7xl mx-auto px-4 pb-24 w-full">
                <GoogleAd slot={import.meta.env.VITE_GOOGLE_ADS_SLOT_LANDING || ''} format="horizontal" className="w-full h-32 md:h-40 rounded-2xl overflow-hidden shadow-sm" />
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Z</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Zest</span>
                    </div>

                    <p className="text-text/40 text-sm">
                        {t('landing.footer.copyright')}
                    </p>

                    <div className="flex items-center gap-4">
                        <a href="#" className="p-2 text-text/40 hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 text-text/40 hover:text-secondary transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 text-text/40 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
