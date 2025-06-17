import React from 'react'
import Navbar from '@/components/navbar/navbar'
import Image from 'next/image'

interface LayoutProps {
    children: React.ReactNode
}

function CommonLayout({ children }: LayoutProps) {
    return (
        <div className='relative w-full h-full'>
           
            <Image
                src={"/background-image.png"}
                alt='backgroundImage'
                layout='fill'
                objectFit='cover'  
                className='-z-10'  
                quality={100}     
            />

            
            <div className='relative z-10'>  
                <div className='w-full'><Navbar /></div>
                <main>{children}</main>
            </div>
        </div>
    )
}

export default CommonLayout