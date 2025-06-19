"use client"
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../ui/kibo-ui/spinner'

function SignupComponent() {

    const [loading, setloading] = useState(false)

    const githubSignup = useCallback(async () => {
        try {
            setloading(true)
            await authClient.signIn.social({
                provider: "github",
                errorCallbackURL: "/signUp",
                callbackURL: "/dashboard",
                fetchOptions: {
                    onSuccess: () => {
                        toast("Welcome Bro")
                        setloading(false)
                    }
                }
            })
        } catch (error: unknown) {
            toast("An error Occured in SignUp")
            console.log(error)
            setloading(false)
        }
    }, [],)

    const googleSignup = useCallback(async () => {
        try {
            setloading(true)
            await authClient.signIn.social({
                provider: "google",
                errorCallbackURL: "/signUp",
                callbackURL: "/dashboard",
                fetchOptions: {
                    onSuccess: () => {
                        toast("Welcome Bro")
                        setloading(false)
                    }
                }
            })
        } catch (error: unknown) {
            toast("An error Occured in SignUp")
            console.log(error)
            setloading(false)
        }
    }, [],)

    return (
        <div className='w-full h-[80%] flex items-center justify-center flex-col font-michroma p-2 bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] rounded-2xl border-2 border-black'>
            <h1 className='font-bold text-center'>SignUp</h1>
            <p className='text-sm text-center mt-2'>Create your Account</p>
            <div className='w-full flex items-center justify-center flex-col mt-2 gap-2'>
                <button onClick={githubSignup} disabled={loading} className='p-2 rounded-lg border-2 border-black flex w-[250px] items-center justify-center gap-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-zinc-950 hover:text-white'>
                    {loading ? <Spinner /> : (
                        <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4.44c-.32-.07-.33-.68-.33-.89l.01-2.47c0-.84-.29-1.39-.61-1.67c2.01-.22 4.11-.97 4.11-4.44c0-.98-.35-1.79-.92-2.42c.09-.22.4-1.14-.09-2.38c0 0-.76-.23-2.48.93c-.72-.2-1.48-.3-2.25-.31c-.76.01-1.54.11-2.25.31c-1.72-1.16-2.48-.93-2.48-.93c-.49 1.24-.18 2.16-.09 2.38c-.57.63-.92 1.44-.92 2.42c0 3.47 2.1 4.22 4.1 4.47c-.26.2-.49.6-.57 1.18c-.52.23-1.82.63-2.62-.75c0 0-.48-.86-1.38-.93c0 0-.88 0-.06.55c0 0 .59.28 1 1.32c0 0 .52 1.75 3.03 1.21l.01 1.53c0 .21-.02.82-.34.89H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="currentColor" /></svg><p>Github</p></>
                    )}
                </button>
                <button onClick={googleSignup} disabled={loading} className='p-2 rounded-lg border-2 border-black flex w-[250px] items-center justify-center gap-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-zinc-950 hover:text-white'>
                    {loading ? <Spinner /> : (
                        <><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 5.5a6.5 6.5 0 1 0 6.326 8H13a1.5 1.5 0 0 1 0-3h7a1.5 1.5 0 0 1 1.5 1.5a9.5 9.5 0 1 1-2.801-6.736a1.5 1.5 0 1 1-2.116 2.127A6.48 6.48 0 0 0 12 5.5" /></g></svg><p>Google</p></>
                    )}
                </button>
            </div>
            <div className='w-full text-center mt-3'>
                <p>Already a user? Sign In<Link className='text-blue-900 font-bold pl-2' href={"/signIn"}>here</Link></p>
            </div>

        </div>
    )
}

export default SignupComponent