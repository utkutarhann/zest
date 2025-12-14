import { useEffect } from 'react';
import { useCookieConsent } from '../../context/CookieContext';

const ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export function GoogleAds() {
    const { consent } = useCookieConsent();

    useEffect(() => {
        if (ADS_ID && consent?.marketing) {
            // Ensure gtag is available (it should be if GA4 is loaded, but let's be safe)
            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            // @ts-ignore
            if (!window.gtag) {
                window.gtag = gtag;
            }

            // Config for Ads
            window.gtag('config', ADS_ID);
        }
    }, [consent?.marketing]);

    return null;
}

export const trackConversion = (label: string) => {
    if (ADS_ID && label && window.gtag) {
        window.gtag('event', 'conversion', {
            'send_to': `${ADS_ID}/${label}`
        });
    }
};
