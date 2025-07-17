"use client";
import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils"; 
import { IconGripVertical } from "@tabler/icons-react";


interface CompareProps {
  firstText?: string;
  secondText?: string;
  className?: string;
  firstTextClassName?: string;
  secondTextClassName?: string;
  initialLeftPercentage?: number;
  initialRightPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
}

export const Compare = ({
  firstText = "Before",
  secondText = "",
  className,
  firstTextClassName,
  secondTextClassName,
  initialLeftPercentage = 4.5,
  initialRightPercentage = 96.5,
  slideMode = "drag",
  showHandlebar = true,
}: CompareProps) => {
  const [leftSliderPercent, setLeftSliderPercent] = useState(initialLeftPercentage);
  const [rightSliderPercent, setRightSliderPercent] = useState(initialRightPercentage);
  const [activeSlider, setActiveSlider] = useState<"left" | "right" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((clientX: number) => {
    if (slideMode !== "drag" || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clickPercent = (x / rect.width) * 100;

    const distToLeft = Math.abs(clickPercent - leftSliderPercent);
    const distToRight = Math.abs(clickPercent - rightSliderPercent);

    
    const handleGrabBuffer = (25 / rect.width) * 100; 
    if (distToLeft < handleGrabBuffer || distToRight < handleGrabBuffer) {
        if (distToLeft < distToRight) {
            setActiveSlider("left");
        } else {
            setActiveSlider("right");
        }
    } else {
        setActiveSlider(null);
    }
  }, [slideMode, leftSliderPercent, rightSliderPercent]);

  const handleEnd = useCallback(() => {
    setActiveSlider(null);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || !activeSlider) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;

      requestAnimationFrame(() => {
        if (activeSlider === "left") {
          setLeftSliderPercent(Math.max(0, Math.min(percent, rightSliderPercent - 1)));
        } else if (activeSlider === "right") {
          setRightSliderPercent(Math.min(100, Math.max(percent, leftSliderPercent + 1)));
        }
      });
    },
    [activeSlider, leftSliderPercent, rightSliderPercent]
  );
  
  const mouseLeaveHandler = () => {
    if (slideMode === "hover") {
        setLeftSliderPercent(initialLeftPercentage);
        setRightSliderPercent(initialRightPercentage);
    }
    handleEnd();
  };


  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if(activeSlider) handleMove(e.clientX);
  }, [handleMove, activeSlider]);
  const handleTouchStart = useCallback((e: React.TouchEvent) => handleStart(e.touches[0].clientX), [handleStart]);
  const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if(activeSlider) handleMove(e.touches[0].clientX);
  }, [handleMove, activeSlider]);


  return (
    <div
      ref={sliderRef}
      className={cn("w-[300px] h-[60px] overflow-hidden bg-gray-200 border-black border-2 rounded-2xl", className)}
      style={{
        position: "relative",
        cursor: activeSlider ? "grabbing" : "default", 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      
      <AnimatePresence>
        {secondText && (
          <motion.div
            className={cn(
              "absolute inset-0 z-10 w-full h-full flex items-center justify-center text-center p-2 font-bold text-2xl text-black",
              secondTextClassName
            )}
          >
            {secondText}
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {firstText && (
          <motion.div
            className={cn(
              "absolute inset-0 z-20 w-full h-full select-none overflow-hidden bg-white",
              "bg-gradient-to-br from-[#C4C4C4] via-slate-200 to-[#F2F2F2]"
            )}
            style={{
              clipPath: `inset(0 ${100 - rightSliderPercent}% 0 ${leftSliderPercent}%)`,
            }}
            transition={{ duration: 0 }}
          >
            <div
              className={cn(
                "w-full h-full flex items-center justify-center text-center p-2 font-[900] font-michroma text-[25px] text-black",
                firstTextClassName
              )}
            >
              {firstText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

     
      {showHandlebar && (
        <motion.div
          className="h-full absolute top-0 z-30"
          style={{ left: `${leftSliderPercent}%`, cursor: 'ew-resize' }}
          transition={{ duration: 0 }}
        >
          
          <div className="w-px h-full bg-slate-400/60 absolute -translate-x-1/2" />
          
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-7 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center shadow-md">
            <IconGripVertical className=" text-gray-400" />
          </div>
        </motion.div>
      )}

     
      {showHandlebar && (
        <motion.div
          className="h-full absolute top-0 z-30"
          style={{ left: `${rightSliderPercent}%`, cursor: 'ew-resize' }}
          transition={{ duration: 0 }}
        >
          
          <div className="w-px h-full bg-slate-400/60 absolute -translate-x-1/2" />
          
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-7 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center shadow-md">
            <IconGripVertical className=" text-gray-400" />
          </div>
        </motion.div>
      )}
    </div>
  );
};