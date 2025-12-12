import { useEffect } from 'react';

interface GoogleAdProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
    className?: string;
}

export function GoogleAd({ slot, format = 'auto', className = '' }: GoogleAdProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Google Ads Error:', err);
        }
    }, []);

    // Placeholder for development if no ID provided
    if (!slot) {
        return (
            <div className={`bg-surface border border-dashed border-text/20 rounded-2xl flex items-center justify-center p-8 text-text/40 text-sm font-medium ${className}`}>
                Reklam Alanı (Google Ads)
            </div>
        );
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={import.meta.env.VITE_GOOGLE_ADS_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
