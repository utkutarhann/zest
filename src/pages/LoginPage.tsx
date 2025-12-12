import { SignIn } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Citrus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dark } from '@clerk/themes';

export function LoginPage() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
                        <Citrus className="w-10 h-10 text-secondary group-hover:rotate-12 transition-transform" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Zest
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-text mb-2">{t('nav.login')}</h1>
                    <p className="text-text/60">{t('landing.description')}</p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            baseTheme: theme === 'dark' ? dark : undefined,
                            variables: {
                                colorPrimary: '#F97316',
                                colorText: theme === 'dark' ? '#F1F5F9' : '#0F172A',
                                colorBackground: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-xl border border-white/10 rounded-2xl w-full",
                            }
                        }}
                        signUpUrl="/signup"
                    />
                </div>
            </motion.div>
        </div>
    );
}
