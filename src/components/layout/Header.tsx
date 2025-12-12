import { useState } from 'react';
import { Menu, X, Citrus, Sun, Moon, Globe, History } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLanguage = () => setLanguage(language === 'tr' ? 'en' : 'tr');

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Citrus className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Zest
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <SignedOut>
                            <Link to="/" className="text-text/80 hover:text-primary transition-colors">{t('nav.home')}</Link>
                            <Link to="/about" className="text-text/80 hover:text-primary transition-colors">{t('nav.about')}</Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center space-x-6 mr-4">
                                <Link to="/about" className="text-text/80 hover:text-primary transition-colors font-medium">
                                    {t('nav.about')}
                                </Link>
                                <Link to="/history" className="flex items-center space-x-2 text-text/80 hover:text-primary transition-colors">
                                    <History className="w-5 h-5" />
                                    <span className="font-medium">{t('history.title') || 'Aramalar'}</span>
                                </Link>
                            </div>

                        </SignedIn>

                        <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                            <button onClick={toggleTheme} className="p-2 text-text/80 hover:text-primary transition-colors">
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button onClick={toggleLanguage} className="flex items-center space-x-1 p-2 text-text/80 hover:text-primary transition-colors font-medium">
                                <Globe className="w-5 h-5" />
                                <span>{language.toUpperCase()}</span>
                            </button>
                        </div>

                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium">
                                {t('nav.login')}
                            </Link>
                        </SignedOut>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <button onClick={toggleTheme} className="p-2 text-text/80 hover:text-primary transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-text hover:text-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-text/80 hover:text-primary transition-colors py-2"
                            >
                                {t('nav.home')}
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-text/80 hover:text-primary transition-colors py-2"
                            >
                                {t('nav.about')}
                            </Link>

                            <button
                                onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                                className="flex items-center space-x-2 text-text/80 hover:text-primary transition-colors py-2"
                            >
                                <Globe className="w-5 h-5" />
                                <span>{language === 'tr' ? 'English' : 'Türkçe'}</span>
                            </button>

                            <SignedIn>
                                <div className="flex justify-center py-2">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </SignedIn>
                            <SignedOut>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full text-center px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
                                >
                                    {t('nav.login')}
                                </Link>
                            </SignedOut>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
