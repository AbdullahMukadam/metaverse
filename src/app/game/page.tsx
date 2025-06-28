
import GamePage from '@/components/GamePageComp/gamePage'
import { auth } from '@/utils/auth'
import { headers } from 'next/headers'


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
    <div className='w-full h-screen font-bold'>
      <GamePage />
    </div>
  )
}

export default page