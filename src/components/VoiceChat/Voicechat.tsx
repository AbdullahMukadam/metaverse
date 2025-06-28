"use client"
import { useAppSelector } from '@/lib/hooks'
import { getSocket, IncomingAudioListener } from '@/utils/Socket'
import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext
    }
}

export interface IncomingAudioData {
    userId: string;
    audioData: number[];
    timestamp: number;
}

function Voicechat() {
    const socketRef = useRef<Socket>(null)
    const mediaStreamRef = useRef<MediaStream>(null)
    const audioStreamRef = useRef<AudioContext>(null)
    const playbackContextRef = useRef<AudioContext>(null)
    const [isSending, setIsSending] = useState(false)
    const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set())
    useEffect(() => {
        const loadProcessor = async () => {
            if (typeof window !== 'undefined') {
                try {
                    const tempContext = new (window.AudioContext || window.webkitAudioContext)()
                    await tempContext.audioWorklet.addModule('/audio-processor.js')
                    await tempContext.close()
                    setIsProcessorLoaded(true)
                } catch (err) {
                    console.error('Failed to load audio processor:', err)
                    setIsProcessorLoaded(false)
                }
            }
        }
        loadProcessor()
    }, [])
    const userData = useAppSelector((state) => state.auth.userData)

    const [isProcessorLoaded, setIsProcessorLoaded] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            playbackContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }

        IncomingAudioListener(
            handleIncomingAudio
        )

        return () => {
            socketRef.current?.off('incomingAudio')
        }

    }, [userData?.id])

    const handleIncomingAudio = (data: IncomingAudioData) => {
        console.log("Incoming Audio:", data)

        if (data.userId === userData?.id) return

        playAudioData(data.audioData)


        setConnectedUsers(prev => new Set(prev).add(data.userId))
    }

    const playAudioData = async (audioData: number[]) => {
        if (!playbackContextRef.current) return

        try {

            const float32Data = new Float32Array(audioData)


            const upsampledData = upsampleAudio(float32Data)


            const audioBuffer = playbackContextRef.current.createBuffer(
                1,
                upsampledData.length,
                playbackContextRef.current.sampleRate
            )


            audioBuffer.copyToChannel(upsampledData, 0)


            const source = playbackContextRef.current.createBufferSource()
            source.buffer = audioBuffer


            const gainNode = playbackContextRef.current.createGain()
            gainNode.gain.value = 0.8

            source.connect(gainNode)
            gainNode.connect(playbackContextRef.current.destination)

            source.start()

        } catch (error) {
            console.error('Error playing audio:', error)
        }
    }

    const upsampleAudio = (data: Float32Array): Float32Array => {

        const originalLength = data.length * 2
        const upsampled = new Float32Array(originalLength)

        for (let i = 0; i < data.length; i++) {
            upsampled[i * 2] = data[i]
            upsampled[i * 2 + 1] = data[i]
        }

        return upsampled
    }

    const handleVoiceInit = async () => {
        if (!isProcessorLoaded) {
            console.error('Audio processor not loaded yet')
            return
        }

        try {
            socketRef.current = getSocket()


            socketRef.current.on('incomingAudio', handleIncomingAudio)

            const media = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            })
            mediaStreamRef.current = media

            audioStreamRef.current = new (window.AudioContext || window.webkitAudioContext)()


            try {
                await audioStreamRef.current.audioWorklet.addModule('/audio-processor.js')
            } catch (err) {
                console.error('Failed to load audio processor in recording context:', err)
                throw err
            }

            const source = audioStreamRef.current.createMediaStreamSource(mediaStreamRef.current)

            const workLetNode = new AudioWorkletNode(
                audioStreamRef.current,
                'audio-processor'
            )

            workLetNode.port.onmessage = (event) => {
                if (!socketRef.current) return
                const audioData = event.data
                const compressed = downsampleAudio(audioData)
                socketRef.current.emit('rawAudio', {
                    data: Array.from(compressed),
                    userId: userData?.id
                })
            }

            source.connect(workLetNode)

            setIsSending(true)
        } catch (err) {
            console.error("Microphone access failed:", err)
        }
    }

    const stopAudioSend = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop())
            mediaStreamRef.current = null
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.close()
            audioStreamRef.current = null
        }

        if (socketRef.current) {
            socketRef.current.off('incomingAudio', handleIncomingAudio)
        }

        setIsSending(false)
        setConnectedUsers(new Set())
    }

    const downsampleAudio = (data: Float32Array): Float32Array => {
        const newLength = Math.floor(data.length / 2)
        const compressed = new Float32Array(newLength)
        for (let i = 0; i < newLength; i++) {
            compressed[i] = data[i * 2]
        }
        return compressed
    }


    useEffect(() => {
        return () => {
            if (playbackContextRef.current) {
                playbackContextRef.current.close()
            }
            stopAudioSend()
        }
    },[])

    return (
        <div className='w-full p-4 z-10 font-michroma bg-black/80 rounded-xl shadow-lg'>
            <div className='flex flex-col items-center space-y-3'>

                <button
                    onClick={isSending ? stopAudioSend : handleVoiceInit}
                    disabled={!isProcessorLoaded}
                    className={`w-full md:w-60 px-4 py-3 cursor-pointer text-center text-sm font-semibold rounded-lg transition-all duration-200
              ${!isProcessorLoaded ? 'bg-gray-400 cursor-not-allowed' :
                            isSending ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} 
              text-white shadow-md`}
                >
                    {!isProcessorLoaded ? 'Loading Audio...' :
                        isSending ? 'Stop Voice Chat' : 'Start Voice Chat'}
                </button>

                <p className='text-xs text-white animate-pulse'>
                    {isSending ? ' Microphone is live' : 'Click to start voice chat'}
                </p>

                {connectedUsers.size > 0 && (
                    <p className='text-xs text-gray-300'>
                        {connectedUsers.size} user(s) speaking
                    </p>
                )}
            </div>
        </div>

    )
}

export default Voicechat