import { useEffect, useState } from 'react';
import { Users, Activity, Zap } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface Stats {
    totalUsers: number;
    activeToday: number;
    totalUsage: number;
}

export function AdminDashboard() {
    const { user } = useUser();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const res = await fetch('http://localhost:3000/api/admin/stats', {
                    headers: {
                        'x-user-id': user.id
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-text/60">Loading stats...</div>;
    }

    const cards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: 'Active Today',
            value: stats?.activeToday || 0,
            icon: Activity,
            color: 'text-green-400',
            bg: 'bg-green-400/10'
        },
        {
            label: 'Total Recipes Generated',
            value: stats?.totalUsage || 0,
            icon: Zap,
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        }
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <span className="text-xs font-medium text-text/40 bg-white/5 px-2 py-1 rounded-full">
                                Real-time
                            </span>
                        </div>
                        <h3 className="text-text/60 font-medium mb-1">{card.label}</h3>
                        <p className="text-3xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
