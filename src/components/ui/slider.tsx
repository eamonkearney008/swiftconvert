"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  // Cleanup effect to remove slider-active class
  React.useEffect(() => {
    return () => {
      document.body.classList.remove('slider-active');
    };
  }, []);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      onPointerDown={(e) => {
        // Prevent scrolling on mobile when interacting with slider
        if (e.pointerType === 'touch') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onTouchStart={(e) => {
        // Prevent default touch behavior to avoid scrolling
        e.preventDefault();
        e.stopPropagation();
        // Add class to body to prevent horizontal scrolling
        document.body.classList.add('slider-active');
      }}
      onTouchMove={(e) => {
        // Prevent horizontal scrolling during touch move
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        // Prevent any default behavior on touch end
        e.preventDefault();
        e.stopPropagation();
        // Remove class from body
        document.body.classList.remove('slider-active');
      }}
      style={{
        touchAction: 'pan-y pinch-zoom',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 sm:size-4 md:size-5 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
          style={{
            // Increase touch target size on mobile
            minWidth: '44px',
            minHeight: '44px',
            marginLeft: '-20px',
            marginTop: '-20px'
          }}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
