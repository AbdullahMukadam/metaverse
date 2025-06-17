import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className='w-full font-michroma bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] text-black border-2 border-black mt-2'>
            {/* Main Footer Content */}
            <div className='max-w-6xl mx-auto px-6 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

                    {/* Brand Section */}
                    <div className='lg:col-span-2 space-y-6'>
                        <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text'>
                            METAVERSE
                        </h2>
                        <p className=' text-sm leading-relaxed max-w-md'>
                            Pioneering the future of digital experiences. Join us as we build the next generation of virtual worlds.
                        </p>
                       
                    </div>

                    {/* Social Links */}
                    <div className='space-y-6'>
                        <h3 className='text-xl font-bold'>Connect</h3>
                        <div className='space-y-4'>
                            <Link
                                href="https://x.com/abd_mukadam"
                                className='flex items-center space-x-3 hover:text-blue-400 transition-colors duration-300 group'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className='w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors'>
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                                    </svg>
                                </div>
                                <span>Twitter (X)</span>
                            </Link>

                            <Link
                                href="https://github.com/AbdullahMukadam"
                                className='flex items-center space-x-3 hover:text-purple-400 transition-colors duration-300 group'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className='w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors'>
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                                    </svg>
                                </div>
                                <span>GitHub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-6'>
                        <h3 className='text-xl font-bold'>Contact</h3>
                        <div className='space-y-4'>
                            <div className=''>
                                <p className='text-sm mb-2'>Get in touch:</p>
                                <a
                                    href='mailto:abdullahmukadam21@gmail.com'
                                    className='text-zinc-950 hover:text-zinc-400 transition-colors duration-300 font-medium text-[14px]'
                                >
                                    abdullahmukadam21@gmail.com
                                </a>
                            </div>

                            <div className=' text-sm space-y-1'>
                                <p>Building in Public</p>
                                <p>Created by Abdullah Mukadam</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-gray-800'>
                <div className='max-w-6xl mx-auto px-6 py-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                        <div className=' text-sm'>
                            © 2025 Metaverse. All rights reserved.
                        </div>

                        <div className='flex items-center space-x-6 text-sm'>
                            <Link href="#" className='hover:text-zinc-950 transition-colors duration-300'>
                                Privacy Policy
                            </Link>
                            <Link href="#" className='hover:text-zinc-950 transition-colors duration-300'>
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer