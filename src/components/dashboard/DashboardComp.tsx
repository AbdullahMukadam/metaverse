"use client"
import { login } from '@/lib/auth/authSlice';
import { useAppDispatch } from '@/lib/hooks'
import React, { useEffect } from 'react'

interface UserData {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
}

interface DashboardCompProps {
    userData: UserData;
}

function DashboardComp({ userData }: DashboardCompProps) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userData) {
            const filteredData = {
                id: userData.id,
                name: userData.name,
                emailVerified: userData.emailVerified,
                email: userData.email,
                image: userData.image || ""
            }
            dispatch(login(filteredData))
        }
    }, [dispatch, userData])

    return (
        <div className='w-full h-full flex justify-center font-michroma'>
            <div className='w-[95%] h-[80%] md:w-[50%] md:h-[50%] flex flex-col gap-2 p-2 border-2 rounded-2xl border-black bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]'>
                <div className='w-full h-fit p-2'>
                  <li>You may need to wait for some time, till we ready the metaverse. </li>
                  <li>Please keep pateinace.</li>
                </div>
                <div className='w-full h-[50%] mt-2 flex items-center justify-center flex-col gap-3'>
                    <h1 className='font-bold text-xl'>Join The World</h1>
                    <button className='p-2 border-2 border-black w-[120px]'>Join</button>
                </div>
            </div>
        </div>
    )
}

export default DashboardComp