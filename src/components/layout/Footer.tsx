import { useLanguage } from '../../context/LanguageContext';
import { useCookieConsent } from '../../context/CookieContext';
import { Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
    const { t } = useLanguage();
    const { setShowModal } = useCookieConsent();

    return (
        <footer className="bg-surface border-t border-black/5 dark:border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                            Zest
                        </h3>
                        <p className="text-text/60 max-w-sm">
                            {t('landing.description')}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-text mb-4">{t('landing.features.title')}</h4>
                        <ul className="space-y-2 text-sm text-text/60">
                            <li><a href="#" className="hover:text-primary transition-colors">{t('landing.features.kitchen')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('landing.features.bar')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('landing.features.fit')}</a></li>
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div>
                        <h4 className="font-bold text-text mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-text/60">
                            <li><a href="#" className="hover:text-primary transition-colors">{t('cookie.privacy')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('cookie.policy')}</a></li>
                            <li>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="hover:text-primary transition-colors text-left"
                                >
                                    {t('cookie.manage')}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-text/40">
                        {t('landing.footer.copyright')}
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-text/40 hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-text/40 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-text/40 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
