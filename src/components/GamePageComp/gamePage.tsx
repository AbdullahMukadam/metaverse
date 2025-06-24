"use client"
import { Character } from '@/app/game/clases/Character';
import { Collision } from '@/app/game/clases/Collision';
import { ForegroundObjects } from '@/app/game/clases/ForegroundObjects';
import { GameMap } from '@/app/game/clases/GameMap';
import { InputHandler } from '@/app/game/clases/InputHandler';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { mapDismantleState } from '@/lib/map/mapSlice';
import { exportArray } from '@/utils/collisionsData';
import { getSocket } from '@/utils/Socket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameMapRef = useRef<GameMap>(null);
  const characterRef = useRef<Character>(null);
  const inputHandlerRef = useRef<InputHandler>(null);
  const collisionRef = useRef<Collision>(null);
  const foregroundRef = useRef<ForegroundObjects>(null);
  const socketRef = useRef<Socket>(null)
  const selectedCharacter = useAppSelector((state) => state.map.character)
  const userData = useAppSelector((state) => state.auth.userData)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const collisionArrayData = exportArray

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!;

    const viewPort = {
      width: 1280,
      height: 720
    }

    canvas.width = viewPort.width;
    canvas.height = viewPort.height;

    gameMapRef.current = new GameMap(canvas, viewPort)
    collisionRef.current = new Collision(collisionArrayData)
    foregroundRef.current = new ForegroundObjects(viewPort)
    socketRef.current = getSocket()

    const characterWidth = selectedCharacter === "Male" ? 70 : 110;
    const characterHeight = selectedCharacter === "Male" ? 70 : 120;
    characterRef.current = new Character(
      canvas.width / 2 - characterWidth,
      canvas.height / 2 - characterHeight / 2,
      selectedCharacter
    );

    inputHandlerRef.current = new InputHandler()

    Promise.all([
      gameMapRef.current.load("/map/metaverse map(not-zoom).png"),
      characterRef.current.load().then(() => console.log("Character loaded successfully"))
        .catch(err => {
          console.error("Character loading failed:", err);
          console.log("Current public directory structure should be:");
        }),
      foregroundRef.current.load("/map/foreground image.png")
    ]).then(() => {

      const gameLoop = () => {
        if (!canvasRef.current || !characterRef.current || !inputHandlerRef.current || !gameMapRef.current || !collisionRef.current || !foregroundRef.current) return;

        const prevX = characterRef.current.worldX
        const prevY = characterRef.current.worldY

        characterRef.current.update(inputHandlerRef.current.keys);

        if (collisionRef.current.detectCollision(characterRef.current)) {
          characterRef.current.worldX = prevX
          characterRef.current.worldY = prevY
        }

        gameMapRef.current?.draw();
        collisionRef.current?.draw(ctx)
        characterRef.current?.draw(ctx);
        foregroundRef.current?.draw(ctx)

        requestAnimationFrame(gameLoop);
      };

      gameLoop();
    }).catch((error) => console.log("Canvas Error:", error))

  }, [collisionArrayData, selectedCharacter])

  const handleLeaveWorld = (): void => {
    if (!socketRef.current) return

    socketRef.current.emit("disconnection", {
      userId: userData?.id
    })
    dispatch(mapDismantleState())
    router.push("/dashboard")
  }

  return (
    <div className='relative w-full h-screen bg-gray-900'>
      <div className='w-full h-full flex items-center justify-center'>
        <canvas
          ref={canvasRef}
          className='border border-black shadow-lg'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <div className='absolute right-3 bottom-[10%] p-3'>
        <button
          className='p-2 bg-red-500 font-semibold cursor-pointer rounded-2xl border border-black font-michroma text-white hover:bg-red-600 transition-colors'
          onClick={handleLeaveWorld}
        >
          Leave World
        </button>
      </div>
    </div>
  )
}

export default GamePage