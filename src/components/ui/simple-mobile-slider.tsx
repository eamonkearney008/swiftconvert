"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleMobileSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function SimpleMobileSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
  ...props
}: SimpleMobileSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const sliderRef = React.useRef<HTMLDivElement>(null)

  const currentValue = value[0] || min
  const percentage = ((currentValue - min) / (max - min)) * 100

  const updateValue = React.useCallback((clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const width = rect.width
    const relativeX = Math.max(0, Math.min(1, x / width))
    
    const newValue = min + (relativeX * (max - min))
    const steppedValue = Math.round(newValue / step) * step
    
    onValueChange([steppedValue])
  }, [min, max, step, onValueChange])

  const handleStart = React.useCallback((clientX: number) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(clientX)
  }, [disabled, updateValue])

  const handleMove = React.useCallback((clientX: number) => {
    if (!isDragging || disabled) return
    updateValue(clientX)
  }, [isDragging, disabled, updateValue])

  const handleEnd = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleStart(e.touches[0].clientX)
  }, [handleStart])

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }, [handleEnd])

  // Mouse events
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }, [handleStart])

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handleMouseUp = React.useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Global mouse events
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative w-full h-6 flex items-center cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      {...props}
    >
      {/* Track */}
      <div className="absolute inset-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
        {/* Range */}
        <div
          className="absolute h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Thumb */}
      <div
        className={cn(
          "absolute w-6 h-6 bg-white dark:bg-slate-100 border-2 border-blue-600 dark:border-blue-500 rounded-full shadow-lg transition-all duration-100",
          isDragging && "scale-125 shadow-xl ring-4 ring-blue-200 dark:ring-blue-800"
        )}
        style={{
          left: `calc(${percentage}% - 12px)`,
          touchAction: 'none'
        }}
      />
    </div>
  )
}
