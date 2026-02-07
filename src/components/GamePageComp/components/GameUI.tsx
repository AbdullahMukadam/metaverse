import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { UserData } from '@/lib/auth/authSlice';

interface GameUIProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  roomId: string | null;
  userData: UserData | null
  onLeaveWorld: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  isOpen,
  setIsOpen,
  isLoading,
  roomId,
  onLeaveWorld,
}) => {
  return (
    <>
      {/* Controls button */}
      <button
        className="absolute text-black cursor-pointer z-50 right-4 top-2 px-4 py-2 border-2 border-black bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2] font-michroma"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        {isOpen ? "Close" : "Controls"}
      </button>

      {/* Controls panel */}
      <div
        className={`absolute z-10 right-4 top-16 p-4 bg-white/95 backdrop-blur-sm border-2 border-black flex flex-col gap-4 font-michroma w-64
          transition-all duration-300 ease-in-out transform origin-top-right
          ${isOpen && !isLoading ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
        `}
      >
        {roomId && (
          <div className="flex flex-col gap-1 pb-3 border-b-2 border-black">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Current Room ID</span>
            <div 
              className="flex items-center gap-2 bg-gray-100 p-2 border-2 border-gray-300 group hover:border-black transition-colors cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                toast.success("Room ID copied!");
              }}
              title="Click to copy"
            >
              <code className="text-sm font-bold flex-1 truncate">{roomId}</code>
              <Copy className="w-4 h-4 text-gray-500 group-hover:text-black" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Actions</span>
         {/*<Voicechat /> */}
          <button
            onClick={onLeaveWorld}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold border-2 border-black 
            transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Leave World
          </button>
        </div>
      </div>
    </>
  );
};
