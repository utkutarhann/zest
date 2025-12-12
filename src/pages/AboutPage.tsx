import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Heart, Globe, ChefHat, ArrowLeft } from 'lucide-react';

export function AboutPage() {
    const { t } = useLanguage();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative">
            {/* Back Button */}
            <button
                onClick={() => window.history.back()}
                className="absolute top-24 left-4 md:left-8 p-2 hover:bg-surface rounded-full transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5 z-10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl mx-auto space-y-16">
                {/* Hero Section */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center space-y-6"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl text-text/80 max-w-2xl mx-auto">
                        {t('about.subtitle')}
                    </p>
                </motion.div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-surface border border-white/5 p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{t('about.mission.title')}</h2>
                        <p className="text-text/70 leading-relaxed">
                            {t('about.mission.desc')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-surface border border-white/5 p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6 text-secondary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{t('about.vision.title')}</h2>
                        <p className="text-text/70 leading-relaxed">
                            {t('about.vision.desc')}
                        </p>
                    </motion.div>
                </div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <h2 className="text-3xl font-bold text-center">{t('about.values.title')}</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { icon: Sparkles, title: t('about.values.innovation'), color: 'text-yellow-400' },
                            { icon: Heart, title: t('about.values.sustainability'), color: 'text-green-400' },
                            { icon: ChefHat, title: t('about.values.creativity'), color: 'text-primary' }
                        ].map((item, index) => (
                            <div key={index} className="bg-surface/50 border border-white/5 p-6 rounded-2xl text-center hover:bg-surface transition-colors">
                                <item.icon className={`w-8 h-8 mx-auto mb-4 ${item.color}`} />
                                <h3 className="font-bold text-lg">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Team Section (Placeholder) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center pt-8 border-t border-white/5"
                >
                    <h2 className="text-2xl font-bold mb-8">{t('about.team.title')}</h2>
                    <div className="flex justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                                <span className="font-bold text-lg">Z</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
