import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface UserData {
    id: string;
    email: string;
    role: string;
    daily_usage_count: number;
    last_usage_date: string;
}

export function AdminUsers() {
    const { user } = useUser();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) return;
            try {
                const res = await fetch('http://localhost:3000/api/admin/users', {
                    headers: {
                        'x-user-id': user.id
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-text/60">Loading users...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Users</h1>

            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-medium text-text/60">Email</th>
                                <th className="p-4 font-medium text-text/60">Role</th>
                                <th className="p-4 font-medium text-text/60">Usage Today</th>
                                <th className="p-4 font-medium text-text/60">Last Active</th>
                                <th className="p-4 font-medium text-text/60">ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin'
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-white/10 text-text/60'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{u.daily_usage_count}</td>
                                    <td className="p-4 text-text/60">
                                        {new Date(u.last_usage_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-xs text-text/40 font-mono">{u.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
