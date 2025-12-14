import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookieConsentState {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp?: string;
}

interface CookieContextType {
    consent: CookieConsentState | null;
    saveConsent: (consent: CookieConsentState) => void;
    acceptAll: () => void;
    rejectAll: () => void; // Rejects optional cookies
    showBanner: boolean;
    setShowBanner: (show: boolean) => void;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const defaultConsent: CookieConsentState = {
    essential: true,
    analytics: false,
    marketing: false,
};

export function CookieProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsent] = useState<CookieConsentState | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem('cookieConsent');
        if (storedConsent) {
            try {
                setConsent(JSON.parse(storedConsent));
                setShowBanner(false);
            } catch (e) {
                console.error("Failed to parse cookie consent", e);
                localStorage.removeItem('cookieConsent');
                setShowBanner(true);
            }
        } else {
            setShowBanner(true);
        }
    }, []);

    const saveConsent = (newConsent: CookieConsentState) => {
        const consentWithTimestamp = {
            ...newConsent,
            timestamp: new Date().toISOString(),
        };
        setConsent(consentWithTimestamp);
        localStorage.setItem('cookieConsent', JSON.stringify(consentWithTimestamp));
        setShowBanner(false);
        setShowModal(false);
    };

    const acceptAll = () => {
        saveConsent({
            essential: true,
            analytics: true,
            marketing: true,
        });
    };

    const rejectAll = () => {
        saveConsent({
            essential: true,
            analytics: false,
            marketing: false,
        });
    };

    return (
        <CookieContext.Provider value={{ consent, saveConsent, acceptAll, rejectAll, showBanner, setShowBanner, showModal, setShowModal }}>
            {children}
        </CookieContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieProvider');
    }
    return context;
}
