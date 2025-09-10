"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MobileSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function MobileSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
  ...props
}: MobileSliderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [startValue, setStartValue] = React.useState(0)
  const sliderRef = React.useRef<HTMLDivElement>(null)

  const currentValue = value[0] || min

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (disabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // Aggressively prevent body scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.classList.add('touch-active')
    
    // Prevent scrolling on html element too
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.touchAction = 'none'
    
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartValue(currentValue)
  }, [disabled, currentValue])

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const sliderRect = sliderRef.current?.getBoundingClientRect()
    if (!sliderRect) return
    
    const touchX = e.touches[0].clientX
    const deltaX = touchX - startX
    const sliderWidth = sliderRect.width
    const thumbWidth = 20 // Approximate thumb width
    
    // Calculate percentage of movement
    const percentage = deltaX / (sliderWidth - thumbWidth)
    const valueRange = max - min
    const newValue = Math.max(min, Math.min(max, startValue + (percentage * valueRange)))
    
    // Round to step
    const steppedValue = Math.round(newValue / step) * step
    
    onValueChange([steppedValue])
  }, [isDragging, disabled, startX, startValue, min, max, step, onValueChange])

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // Restore body scrolling
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    document.body.classList.remove('touch-active')
    
    // Restore html element
    document.documentElement.style.overflow = ''
    document.documentElement.style.touchAction = ''
    
    setIsDragging(false)
  }, [isDragging])

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (disabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    setStartX(e.clientX)
    setStartValue(currentValue)
  }, [disabled, currentValue])

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const sliderRect = sliderRef.current?.getBoundingClientRect()
    if (!sliderRect) return
    
    const deltaX = e.clientX - startX
    const sliderWidth = sliderRect.width
    const thumbWidth = 20
    
    const percentage = deltaX / (sliderWidth - thumbWidth)
    const valueRange = max - min
    const newValue = Math.max(min, Math.min(max, startValue + (percentage * valueRange)))
    const steppedValue = Math.round(newValue / step) * step
    
    onValueChange([steppedValue])
  }, [isDragging, disabled, startX, startValue, min, max, step, onValueChange])

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse event listeners
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

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.classList.remove('touch-active')
      document.documentElement.style.overflow = ''
      document.documentElement.style.touchAction = ''
    }
  }, [])

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div
      ref={sliderRef}
      className={cn(
        "mobile-slider-container relative flex w-full items-center select-none",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      {...props}
    >
      {/* Track */}
      <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        {/* Range */}
        <div
          className="absolute h-full bg-blue-600 dark:bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Thumb */}
      <div
        className={cn(
          "absolute w-5 h-5 bg-white dark:bg-slate-100 border-2 border-blue-600 dark:border-blue-500 rounded-full shadow-sm transition-shadow",
          isDragging && "shadow-lg ring-4 ring-blue-200 dark:ring-blue-800",
          "touch-manipulation"
        )}
        style={{
          left: `calc(${percentage}% - 10px)`,
          touchAction: 'none',
          minWidth: '44px',
          minHeight: '44px',
          marginLeft: '-22px',
          marginTop: '-22px'
        }}
      />
    </div>
  )
}
