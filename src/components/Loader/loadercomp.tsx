import React from 'react'

function Loadercomp() {
    return (
        <div>
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-zinc-400 text-4xl animate-spin flex items-center justify-center border-t-black rounded-full"
                >
                    <div className="w-16 h-16 border-4 border-transparent text-blue-200 text-2xl animate-spin flex items-center justify-center border-t-blue-950 rounded-full"></div>
                </div>
            </div>

        </div>
    )
}

export default Loadercomp