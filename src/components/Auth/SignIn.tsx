import React, { useCallback } from 'react'

function SignInComponent() {
    const signIn = useCallback(() => {
        console.log("This is signin")
    }, [],)
    return (
        <div onClick={signIn}>SignInComponent</div>
    )
}

export default SignInComponent