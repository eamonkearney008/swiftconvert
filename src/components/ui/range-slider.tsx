"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function RangeSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
  ...props
}: RangeSliderProps) {
  const currentValue = value[0] || min

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    onValueChange([newValue])
  }, [onValueChange])

  return (
    <div className={cn("relative w-full", className)} {...props}>
      {/* Custom styled range input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          disabled && "opacity-50 cursor-not-allowed",
          // Webkit styles for mobile
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-lg",
          "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all",
          "[&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-webkit-slider-thumb]:active:scale-125 [&::-webkit-slider-thumb]:active:shadow-xl",
          // Firefox styles
          "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none",
          "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white",
          "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600",
          "[&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer",
          // Track styles
          "[&::-webkit-slider-track]:bg-slate-200 [&::-webkit-slider-track]:dark:bg-slate-700",
          "[&::-webkit-slider-track]:rounded-lg [&::-webkit-slider-track]:h-2",
          "[&::-moz-range-track]:bg-slate-200 [&::-moz-range-track]:dark:bg-slate-700",
          "[&::-moz-range-track]:rounded-lg [&::-moz-range-track]:h-2"
        )}
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((currentValue - min) / (max - min)) * 100}%, #e2e8f0 ${((currentValue - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
          touchAction: 'manipulation'
        }}
      />
    </div>
  )
}
