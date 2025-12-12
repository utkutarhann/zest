import { Martini, Utensils, Wine, Activity } from 'lucide-react';

export type ScenarioId = 'bar' | 'kitchen' | 'full' | 'fit';

export interface Scenario {
    id: ScenarioId;
    title: string;
    description: string;
    icon: any; // Lucide icon component
    color: string;
}

export const scenarios: Scenario[] = [
    {
        id: 'bar',
        title: 'Bar Modu',
        description: 'Sadece içecek ve kokteyl odaklı.',
        icon: Martini,
        color: 'from-pink-500 to-rose-500',
    },
    {
        id: 'kitchen',
        title: 'Mutfak Modu',
        description: 'Sadece yemek ve atıştırmalık.',
        icon: Utensils,
        color: 'from-orange-400 to-amber-500',
    },
    {
        id: 'full',
        title: 'Tam Menü',
        description: 'Yemek ve yanında içecek eşleşmesi.',
        icon: Wine,
        color: 'from-purple-500 to-indigo-600',
    },
    {
        id: 'fit',
        title: 'Fit & Sağlıklı',
        description: 'Düşük kalorili, sağlıklı seçenekler.',
        icon: Activity,
        color: 'from-emerald-400 to-green-600',
    },
];
