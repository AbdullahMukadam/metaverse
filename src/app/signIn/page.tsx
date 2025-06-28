import SignInComponent from '@/components/Auth/SignIn'
import React from 'react'

function SignIn() {
  return (
    <div className='w-full p-4 h-screen'>
      <div className='w-full h-full md:flex md:items-center md:justify-center'>
        <div className='md:w-1/2 h-full w-full'>
          <SignInComponent />
        </div>
      </div>
    </div>
  )
}

export default SignIn