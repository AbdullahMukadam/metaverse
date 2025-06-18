"use client"
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React from 'react'

function DashboardComp() {

    const router = useRouter()
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    }
    return (
        <div className='w-full'>
            <button className='p-2' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default DashboardComp