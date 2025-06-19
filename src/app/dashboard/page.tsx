import DashboardComp from '@/components/dashboard/DashboardComp'
import { auth } from '@/utils/auth'
import { headers } from 'next/headers'
import React from 'react'

async function page() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return (
      <div className='w-full p-4 font-michroma text-center'>
        <h1 className='text-3xl font-bold'>Not Authenticated, Sign Up Again.</h1>
      </div>
    )
  }

  return (
    <div className='w-full p-4 h-screen'>
      <DashboardComp userData={session.user} />
    </div>
  )


}

export default page