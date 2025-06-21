"use client"
import { Character } from '@/app/game/clases/Character';
import { GameMap } from '@/app/game/clases/GameMap';
import { useAppDispatch } from '@/lib/hooks';
import { mapLoadingState } from '@/lib/map/mapSlice';
import React, { useEffect, useRef } from 'react'

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap>(null);
  const characterRef = useRef<Character>(null);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!;
    gameMapRef.current = new GameMap(canvas)
    characterRef.current = new Character(-360, -410);

    Promise.all([
      gameMapRef.current.load("/map/metaverse map.png"),
      characterRef.current.load()
    ]).then(() => {
      dispatch(mapLoadingState())

     /* gameMapRef.current?.centerOn(
        characterRef.current?.x || -360,
        characterRef.current?.y || -410
      ); */

      const gameLoop = () => {
        if (!canvasRef.current) return;

        const viewport = {
          width: canvas.width,
          height: canvas.height
        };

        gameMapRef.current?.draw();
        characterRef.current?.draw(ctx, viewport);

        requestAnimationFrame(gameLoop);
      };

      gameLoop();
    }).catch((error) => console.log("Canvas Error:", error))

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <div className='relative w-full h-full'>
      <canvas ref={canvasRef} className=''></canvas>
    </div>
  )
}

export default GamePage