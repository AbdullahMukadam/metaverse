import Image from 'next/image'
import React from 'react'

function Hero() {
    return (
        <div className='w-full min-h-screen relative font-michroma overflow-hidden'>

            <div className='absolute inset-0 -z-10'>
                <Image
                    src="/hero-background-img.png"
                    alt="Hero background"
                    fill
                    className="object-cover rounded-2xl"
                    quality={100}
                    priority
                />

                <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
            </div>


            <div className='relative z-10 min-h-screen flex items-center justify-center px-4 py-16'>
                <div className='max-w-4xl mx-auto text-center space-y-8'>


                    <div className='space-y-4'>
                        <h1 className='font-bold text-4xl md:text-7xl lg:text-8xl text-white tracking-tighter drop-shadow-2xl'>
                            METAVERSE
                        </h1>
                        <p className='text-md md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed'>
                            Step into the future where digital worlds become reality
                        </p>
                    </div>


                    <div className='relative group'>
                        <div className='bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 ease-out hover:scale-105'>
                            <div className='relative w-full max-w-md mx-auto aspect-square'>
                                <Image
                                    src="/hero-background-img.png"
                                    alt="Metaverse showcase"
                                    fill
                                    className="object-cover rounded-2xl"
                                    quality={100}
                                />
                            </div>
                        </div>
                    </div>


                    <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
                        <button className='px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg'>
                            Explore Now
                        </button>
                        <button className='px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105'>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>


            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'>
                <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
                    <div className='w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce'></div>
                </div>
            </div>
            <div className='w-full flex flex-col gap-4 md:flex-row'>
                <div className='w-full md:w-[50%] p-4 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                    <h2 className='font-bold text-black text-base md:text-lg'> Step into the future where digital worlds become reality</h2>
                    <p className='text-[14px] md:text-lg'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto eius asperiores, a deserunt non, cum exercitationem voluptatum fugit ipsam nesciunt perspiciatis. </p>
                    <div className='w-full p-3'>
                        <p className='text-[12px] md:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia magni repudiandae aut laboriosam nam ipsa voluptates repellendus quod amet minus tenetur unde exercitationem delectus, soluta quos, adipisci mollitia fugit voluptas!</p>
                    </div>
                    <button className='p-3 rounded-3xl border-2 relative group'>
                        <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                        <span className='group-hover:text-white relative'>Get Started</span>
                    </button>
                </div>
                <div className='w-full h-[400px] md:w-[50%]'>
                    <Image
                        src={"/background-image.png"}
                        alt="Metaverse showcase"
                        quality={100}
                        className=" rounded-2xl border-2 border-black w-full h-full"
                        height={500}
                        width={500}
                    />
                </div>
            </div>
            <div className='w-full mt-2 flex flex-col gap-4 md:flex-row'>
                <div className='w-full h-[400px] md:w-[50%]'>
                    <Image
                        src={"/background-image.png"}
                        alt="Metaverse showcase"
                        quality={100}
                        className=" rounded-2xl border-2 border-black w-full h-full"
                        height={500}
                        width={520}
                    />
                </div>
                <div className='w-full md:w-[50%] p-4 h-[400px] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] border-2 border-solid border-black'>
                    <h2 className='font-bold text-black text-base md:text-lg'> Step into the future where digital worlds become reality</h2>
                    <p className='text-[14px] md:text-lg'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto eius asperiores, a deserunt non, cum exercitationem voluptatum fugit ipsam nesciunt perspiciatis. </p>
                    <div className='w-full p-3'>
                        <p className='text-[12px] md:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia magni repudiandae aut laboriosam nam ipsa voluptates repellendus quod amet minus tenetur unde exercitationem delectus, soluta quos, adipisci mollitia fugit voluptas!</p>
                    </div>
                    <button className='p-3 rounded-3xl border-2 relative group'>
                        <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                        <span className='group-hover:text-white relative'>Get Started</span>
                    </button>
                </div>
            </div>
            <div className='w-full p-2 flex flex-col md:flex-row bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] mt-2 border-2 border-black'>
                <div className='w-full'>
                    <h1 className='font-bold text-xl'>Metaverse</h1>
                    <div className='w-full p-1'>
                        <p className='md:text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid illum iusto iste a magni!</p>
                    </div>
                    <button className='hidden p-3 rounded-3xl border-2 relative group mt-2 md:block'>
                        <span className='w-0 h-full absolute transition-all ease-in-out duration-300 bg-black top-0 left-0 rounded-3xl group-hover:w-full'></span>
                        <span className='group-hover:text-white relative'>Get Started</span>
                    </button>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <Image src={"/portraitshingshing-1.webp"} width={250} height={250} alt='character' unoptimized/>
                </div>
            </div>
        </div>
    )
}

export default Hero