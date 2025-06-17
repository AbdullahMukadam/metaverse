"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Navbar() {
    const [isOpen, setisOpen] = useState(false);
    const router = useRouter()
    return (
        <div className='w-full p-5 relative '>
            <div className='w-full font-michroma font-bold p-5 flex items-center justify-between border-2 border-black rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] text-black'>
                <div className='w-[50%]'>
                    <h1>Metaverse</h1>
                </div>
                <div className='w-[50%] flex justify-end '>
                    <div className='cursor-pointer flex items-center flex-col gap-1 md:hidden' onClick={() => setisOpen((prev) => !prev)}>
                        <div className={`w-[40px] h-[4px] transition-all ease-in-out duration-100 bg-black ${isOpen ? "translate-x-[20%]" : ""}`}></div>
                        <div className={`w-[40px] h-[4px] transition-all ease-in-out duration-100 bg-black ${isOpen ? "-translate-x-[20%]" : ""}`}></div>
                    </div>

                    <button onClick={() => router.push("/signUp")} className='hidden border-[1px] border-solid border-black p-2 relative md:flex items-center justify-center cursor-pointer group'>
                        <span className='absolute top-0 left-0 z-10 w-0 h-full bg-black transition-all duration-300 ease-in-out group-hover:w-full'></span>
                        <span className='relative z-20 group-hover:text-white'>Get Started</span>
                    </button>
                </div>


            </div>
            {isOpen &&
                <div className='w-full pl-3 pr-3 relative z-50 md:hidden'>
                    <div className='w-full p-2 animate-fade-in-normal flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] absolute left-0 rounded-t-2xl border-2 border-black font-michroma font-bold'>
                        <Link href={"/"}>About</Link>
                        <button>Get Started</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Navbar