'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SSOReciever() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const an = searchParams.get('an');
    const by = searchParams.get('by');

    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setError('No token found in URL');
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sso-user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl animate-pulse">กำลังตรวจสอบสิทธิ์...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
                    <h2 className="text-lg font-bold mb-2">เกิดข้อผิดพลาดในการเข้าสู่ระบบ</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 shadow-xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold">ยินดีต้อนรับเข้าสู่ระบบ</h1>
                        <div className="mt-1 px-2 py-0.5 bg-white/20 rounded text-xs font-medium uppercase tracking-wider">
                            Source: {by || 'unknown'}
                        </div>
                    </div>
                    <p className="mt-2 text-white/80">{user?.email}</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">ชื่อผู้ใช้</label>
                        <p className="text-zinc-900 dark:text-zinc-100 font-medium">{user?.name}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Context จากระบบผู้ป่วยนอก</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">AN: {an || 'ไม่พบค่า'}</span>
                                </div>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs text-zinc-400 text-center uppercase tracking-widest">Single Sign-On Authenticated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SSOPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <SSOReciever />
        </Suspense>
    );
}
