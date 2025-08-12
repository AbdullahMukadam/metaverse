import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import songs from "../../scripts/songs.json"

interface Props {
    handleMusicClose: () => void;
}

type Song = {
    title: string;
    url: string;
};

function MusicPlayer({ handleMusicClose }: Props) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleNext);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleNext);
        };
    }, [currentSong]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (songs.length === 0) return;
        const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(nextIndex);
        setCurrentSong(songs[nextIndex]);
        setIsPlaying(false);
    };

    const handlePrevious = () => {
        if (songs.length === 0) return;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
        setCurrentIndex(prevIndex);
        setCurrentSong(songs[prevIndex]);
        setIsPlaying(false);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value) / 100;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? volume : 0;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // const selectSong = (song: Song, index: number) => {
    //     setCurrentSong(song);
    //     setCurrentIndex(index);
    //     setIsPlaying(false);
    // };

    return (
        <div className='w-[75%] h-[75%] rounded-2xl bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] p-4 font-michroma overflow-y-auto'>
            <div className='w-full p-2 flex items-center justify-between text-xl'>
                <h1 className='font-bold text-black'>Music Player</h1>
                <button className='text-black cursor-pointer' onClick={handleMusicClose}>X</button>
            </div>
            <div className='w-full p-2 flex flex-col space-y-4'>
              {songs?.map((song, index) => (
                 <div key={index} className='w-full  p-4 border-[1px] border-gray-300 rounded-xl bg-white/30 backdrop-blur-sm'>
                    <div className='flex items-center justify-between mb-3 cursor-pointer' 
                     onClick={() => {
                        setCurrentSong(song);
                        setCurrentIndex(index);
                    }}
                     >
                        <h2 className='text-black font-semibold text-lg'>{song.title}</h2>
                        <div className='flex items-center gap-2'>
                            <button
                                className='px-3 py-1 bg-black/10 hover:bg-black/20 rounded-lg transition-colors text-sm'
                            >
                                Select
                            </button>
                        </div>
                    </div>
                    
                    {currentSong === song && (
                        <div className='space-y-3'>
                            <audio ref={audioRef} src={song.url} />
                            
                            {/* Custom Controls */}
                            <div className='flex items-center justify-center gap-4 mb-3'>
                                <button
                                    onClick={handlePrevious}
                                    className='p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors'
                                >
                                    <SkipBack className='w-4 h-4 text-black' />
                                </button>
                                
                                <button
                                    onClick={togglePlay}
                                    className='p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors'
                                >
                                    {isPlaying ? <Pause className='w-5 h-5 text-black' /> : <Play className='w-5 h-5 text-black' />}
                                </button>
                                
                                <button
                                    onClick={handleNext}
                                    className='p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors'
                                >
                                    <SkipForward className='w-4 h-4 text-black' />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className='flex items-center gap-3 text-sm text-black/70'>
                                <span>{formatTime(currentTime)}</span>
                                <div className='flex-1'>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={duration ? (currentTime / duration) * 100 : 0}
                                        onChange={handleSeek}
                                        className='w-full h-1 accent-zinc-900 bg-black/20 rounded-lg appearance-none cursor-pointer'
                                    />
                                </div>
                                <span>{formatTime(duration)}</span>
                            </div>

                            {/* Volume Control */}
                            <div className='flex items-center gap-3 mt-2'>
                                <h3 className='text-sm'>Volume: </h3>
                                <button onClick={toggleMute} className='text-black/70 hover:text-black transition-colors'>
                                    {isMuted ? <VolumeX className='w-4 h-4' /> : <Volume2 className='w-4 h-4' />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume * 100}
                                    onChange={handleVolumeChange}
                                    className='w-20 h-1 accent-zinc-900 bg-black/20 rounded-lg appearance-none cursor-pointer'
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* {currentSong !== song && (
                        <div className='mt-2'>
                            <audio src={song.url} controls className='w-full'></audio>
                        </div>
                    )} */}
                 </div>
              ))}
            </div>
        </div>
    )
}

export default MusicPlayer