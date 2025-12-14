import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useCookieConsent } from '../../context/CookieContext';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
    const location = useLocation();
    const { consent } = useCookieConsent();

    useEffect(() => {
        if (GA_MEASUREMENT_ID && consent?.analytics) {
            if (!ReactGA.isInitialized) {
                ReactGA.initialize(GA_MEASUREMENT_ID);
            }
        }
    }, [consent?.analytics]);

    useEffect(() => {
        if (GA_MEASUREMENT_ID && consent?.analytics) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location, consent?.analytics]);

    return null;
}
