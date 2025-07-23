'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

// Types
interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: 'admin' | 'host_admin';
    status: 'pending' | 'accepted';
}

interface SignUpPayload {
    email: string;
    password: string;
    username: string;
}

export default function AccessBoardPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [form, setForm] = useState<SignUpPayload>({ email: '', password: '', username: '' });
    const [loading, setLoading] = useState(false);

    const currentUser = session?.user;
const userRole = currentUser?.user_metadata?.role;

    const fetchAdmins = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, username, role, status')
            .in('role', ['admin', 'host_admin']);

        if (error) console.error('Fetch error:', error);
        else setAdmins(data || []);
    };

    const addAdmin = async () => {
        setLoading(true);
        const { email, password, username } = form;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    role: 'admin',
                    status: 'pending',
                },
            },
        });

        if (error) alert('Failed to register admin: ' + error.message);
        else {
            setForm({ email: '', password: '', username: '' });
            await fetchAdmins();
        }
        setLoading(false);
    };

    const acceptAdmin = async (id: string) => {
        const { error } = await supabase
            .from('users')
            .update({ status: 'accepted' })
            .eq('id', id);

        if (error) alert('Failed to accept admin');
        else await fetchAdmins();
    };

    const removeAdmin = async (id: string, role: string) => {
        const { error } = await supabase
            .from('users')
            .update({ role: 'client', status: 'accepted' })
            .eq('id', id);

        if (error) alert('Failed to remove admin');
        else await fetchAdmins();
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (currentUser) fetchAdmins();
    }, [currentUser]);

    if (!currentUser) {
        return <div className="text-center py-12">Please log in as <b>host_admin</b>.</div>;
    }

    return (
        <div className="min-h-screen px-6 pt-20 py-10 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-cyan-500">Admin Access Board</h1>

                {/* Promote New Admin */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4 border dark:border-gray-800">
                    <h2 className="text-xl font-semibold">Register New Admin</h2>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <button
                            onClick={addAdmin}
                            disabled={loading || !form.email || !form.password || !form.username}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Register Admin'}
                        </button>
                    </div>
                </div>

                {/* Admin List */}
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Current Admins</h2>
                    <ul className="space-y-2">
                        {admins.map((admin) => (
                            <li
                                key={admin.id}
                                className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border dark:border-gray-800"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium">{admin.username || admin.email}</div>
                                    <div className="flex gap-2 text-xs">
                                        <span
                                            className={`px-2 py-0.5 font-semibold rounded-full ${admin.role === 'host_admin'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white'
                                                    : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-700 dark:text-white'
                                                }`}
                                        >
                                            {admin.role}
                                        </span>
                                        <span className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                            {admin.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {admin.status === 'pending' && (
                                        <button
                                            onClick={() => acceptAdmin(admin.id)}
                                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {admin.role !== 'host_admin' && (
                                        <button
                                            onClick={() => removeAdmin(admin.id, admin.role)}
                                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    {admin.role === 'host_admin' && (
                                        <span className="text-xs text-gray-400 italic">Protected</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}