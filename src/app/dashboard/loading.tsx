import React from 'react'
import Loadercomp from '../../components/Loader/loadercomp'

function DashboardLoader() {
    return (
        <div className='w-full h-[100vh] p-2 flex items-center justify-center'>
            <Loadercomp />
        </div>
    )
}

export default DashboardLoader