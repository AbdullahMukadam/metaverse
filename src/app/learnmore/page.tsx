import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function LearnMore() {
    return (
        <div className='w-full min-h-screen relative font-michroma overflow-hidden bg-transparent'>

            {/* Header Section */}
            <div className='relative z-10 px-4 py-16'>
                <div className='max-w-6xl mx-auto text-center space-y-8'>
                    <div className='space-y-4'>
                        <h1 className='font-bold text-4xl md:text-6xl lg:text-7xl text-zinc-900 tracking-tighter drop-shadow-2xl'>
                            LEARN MORE
                        </h1>
                        <h2 className='font-bold text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter drop-shadow-2xl'>
                            METAVERSE
                        </h2>
                        <p className='text-md md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed'>
                            Step into the future where digital worlds become reality
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className='max-w-6xl mx-auto px-4 space-y-8'>

                {/* Avatar Customization */}
                <div className='w-full flex flex-col gap-4 md:flex-row'>
                    <div className='w-full md:w-[50%] p-6 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                        <h3 className='font-bold text-black text-xl md:text-2xl mb-4'>Choose Your Character</h3>
                        <p className='text-[14px] md:text-lg text-black mb-4'>
                            Customize your avatar and join millions in shared virtual spaces.
                        </p>

                        <div className='w-full p-3'>
                            <p className='text-[12px] md:text-base text-black'>
                                <span className='font-semibold block mb-2'>Avatar Options:</span>
                                • Male characters<br />
                                • Female characters<br />
                                • Unique digital identities<br />
                                • Join shared virtual spaces
                            </p>
                        </div>

                        <button className='p-3 rounded-3xl border-2 border-black relative group mt-4'>
                            <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                            <span className='group-hover:text-white relative text-black'>Create Avatar</span>
                        </button>
                    </div>
                    <div className='w-full h-[400px] md:w-[50%]'>
                        <Image
                            src={"/portraitshingshing-1.webp"}
                            alt="Character showcase"
                            width={500}
                            height={400}
                            className="rounded-2xl border-2 border-black w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Real-time Features */}
                <div className='w-full mt-4 flex flex-col gap-4 md:flex-row'>
                    <div className='w-full h-[400px] md:w-[50%]'>
                        <Image
                            src={"/gif.gif"}
                            alt="Real-time interactions"
                            width={500}
                            height={400}
                            className="rounded-2xl border-2 border-black w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                    <div className='w-full md:w-[50%] p-6 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                        <h3 className='font-bold text-black text-xl md:text-2xl mb-4'>Real-Time Experience</h3>
                        <p className='text-[14px] md:text-lg text-black mb-4'>
                            Connect with friends through voice chat and interact in shared 3D spaces.
                        </p>

                        <div className='w-full p-3'>
                            <p className='text-[12px] md:text-base text-black'>
                                <span className='font-semibold block mb-2'>Current Features:</span>
                                • Real-time voice chat<br />
                                • Cross-platform worlds<br />
                                • Interactive environments<br />
                                • Shared virtual experiences
                            </p>
                        </div>

                        <button className='p-3 rounded-3xl border-2 border-black relative group mt-4'>
                            <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                            <span className='group-hover:text-white relative text-black'>Try Voice Chat</span>
                        </button>
                    </div>
                </div>

                {/* Cross-Platform Experience */}
                <div className='w-full mt-4 flex flex-col gap-4 md:flex-row'>
                    <div className='w-full md:w-[50%] p-6 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                        <h3 className='font-bold text-black text-xl md:text-2xl mb-4'>Cross-Platform Worlds</h3>
                        <p className='text-[14px] md:text-lg text-black mb-4'>
                            Access your metaverse experience from any device, anywhere.
                        </p>

                        <div className='w-full p-3'>
                            <p className='text-[12px] md:text-base text-black'>
                                <span className='font-semibold block mb-2'>Platform Benefits:</span>
                                • Seamless cross-device access<br />
                                • No downloads required<br />
                                • Works on desktop and mobile<br />
                                • Consistent experience everywhere
                            </p>
                        </div>

                        <button className='p-3 rounded-3xl border-2 border-black relative group mt-4'>
                            <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                            <span className='group-hover:text-white relative text-black'>Access Now</span>
                        </button>
                    </div>
                    <div className='w-full h-[400px] md:w-[50%]'>
                        <Image
                            src={"/gif1.gif"}
                            alt="Cross-platform experience"
                            width={500}
                            height={400}
                            className="rounded-2xl border-2 border-black w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Interactive Environments */}
                <div className='w-full mt-4 flex flex-col gap-4 md:flex-row'>
                    <div className='w-full h-[400px] md:w-[50%]'>
                        <Image
                            src={"/hero-background-img.png"}
                            alt="Interactive environments"
                            width={500}
                            height={400}
                            className="rounded-2xl border-2 border-black w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                    <div className='w-full md:w-[50%] p-6 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                        <h3 className='font-bold text-black text-xl md:text-2xl mb-4'>Interactive Environments</h3>
                        <p className='text-[14px] md:text-lg text-black mb-4'>
                            Explore immersive worlds where you can collaborate, socialize, and create memories together.
                        </p>

                        <div className='w-full p-3'>
                            <p className='text-[12px] md:text-base text-black'>
                                <span className='font-semibold block mb-2'>Environment Features:</span>
                                • Shared virtual spaces<br />
                                • Real-time interactions<br />
                                • Social collaboration tools<br />
                                • Memory-making experiences
                            </p>
                        </div>

                        <button className='p-3 rounded-3xl border-2 border-black relative group mt-4'>
                            <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                            <span className='group-hover:text-white relative text-black'>Explore Worlds</span>
                        </button>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className='w-full p-8 flex flex-col md:flex-row bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] mt-8 border-2 border-black rounded-2xl'>
                    <div className='w-full md:w-[60%]'>
                        <h1 className='font-bold text-2xl md:text-3xl text-black mb-4'>Ready to Enter the Metaverse?</h1>
                        <div className='w-full p-1'>
                            <p className='md:text-xl text-black mb-6'>
                                Join a vibrant metaverse where you can voice-chat with friends, collaborate in shared virtual spaces, and create memories together—no matter where you are.
                            </p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Link href="/signUp" className='px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg text-center'>
                                Get Started
                            </Link>
                            <Link href={"/"} className='px-8 py-4 bg-transparent border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-105'>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                    <div className='w-full md:w-[40%] flex items-center justify-center mt-6 md:mt-0'>
                        <Image
                            src={"/portraitshingshing-1.webp"}
                            width={250}
                            height={250}
                            alt='character showcase'
                            className='rounded-2xl border-2 border-black'
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            {/* Bottom spacing */}
            <div className='pb-16'></div>
        </div>
    )
}

export default LearnMore