"use client"
import React from 'react'
import Navbar from '@/components/navbar/navbar'
import Image from 'next/image'
import { useAppSelector } from '@/lib/hooks'


interface LayoutProps {
    children: React.ReactNode
}

function CommonLayout({ children }: LayoutProps) {
    const isMapLoaded = useAppSelector((state) => state.map.isLoaded)
    return (
        <div className='relative w-full h-full'>

            <Image
                src="/background-image.png"
                alt="backgroundImage"
                fill
                className="-z-10 object-cover"
                quality={100}
                priority
            />

            <div className="relative z-10">
                {!isMapLoaded && <div className="w-full">
                    <Navbar />
                </div>}

                <main>
                    {children}
                </main>

            </div>
        </div>
    )
}

export default CommonLayout