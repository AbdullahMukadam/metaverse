import React, { forwardRef } from 'react';

interface GameCanvasProps {
  isLoading: boolean;
  isTransitionShowed: boolean;
  loadingMessage: string;
}

export const GameCanvas = forwardRef<HTMLCanvasElement | null, GameCanvasProps>(
  ({ isLoading, isTransitionShowed, loadingMessage }, ref) => {
    return (
      <>
        {/* Transition overlay */}
        {isTransitionShowed && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] p-6 shadow-lg text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
              <h1 className='text-black font-bold font-michroma text-lg'>
                Hang On a little
              </h1>
              <div className='mt-2 text-gray-400 text-sm'>
                Please wait while we prepare your game...
              </div>
            </div>
          </div>
        )}

        {/* Main canvas */}
        <canvas
          ref={ref}
          className=''
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 2
          }}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
              <h1 className='text-white font-bold font-michroma text-lg'>
                {loadingMessage}
              </h1>
              <div className='mt-2 text-gray-400 text-sm'>
                Please wait while we prepare your game...
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
