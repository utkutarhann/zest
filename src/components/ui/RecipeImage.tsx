import { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface RecipeImageProps {
    term: string;
    alt: string;
    className?: string;
}

export function RecipeImage({ term, alt, className = '' }: RecipeImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Primary source: LoremFlickr (more reliable than source.unsplash.com)
    // We add 'food' tag to ensure relevance
    const src = `https://loremflickr.com/600/400/food,${encodeURIComponent(term)}/all`;

    // Fallback source: A reliable placeholder if external images fail
    const fallbackSrc = 'https://placehold.co/600x400/orange/white?text=Lezzetli+Tarif';

    return (
        <div className={`relative overflow-hidden bg-surface-light ${className}`}>
            {/* Loading Skeleton */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-light animate-pulse z-10">
                    <Loader2 className="w-8 h-8 text-primary/20 animate-spin" />
                </div>
            )}

            {/* Error State (if both primary and fallback fail, though fallback is static) */}
            {hasError && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-light text-text/40">
                    <ImageOff className="w-8 h-8 mb-2" />
                    <span className="text-xs">Görsel Yüklenemedi</span>
                </div>
            )}

            {/* Image */}
            <img
                src={hasError ? fallbackSrc : src}
                alt={alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    if (!hasError) {
                        setHasError(true);
                        // Don't set loading to false yet, let the fallback load
                    } else {
                        setIsLoading(false); // Fallback also failed
                    }
                }}
            />
        </div>
    );
}
