import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * BorderBeam Component
 * 
 * Creates an animated beam effect that travels around the border of an element.
 * Uses GPU-accelerated transforms for smooth 60fps animation.
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Beam color (default: sky blue)
 * @param {number} props.duration - Animation duration in seconds (default: 4)
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 * @param {number} props.size - Beam size in pixels (default: 200)
 * @param {React.ReactNode} props.children - Child elements to render with border beam
 */
export const BorderBeam = ({
  className,
  color = '#38bdf8',
  duration = 4,
  delay = 0,
  size = 200,
  children,
  ...props
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    const element = containerRef.current;
    element.style.setProperty('--border-beam-duration', `${duration}s`);
    element.style.setProperty('--border-beam-delay', `${delay}s`);
    element.style.setProperty('--border-beam-size', `${size}px`);
  }, [duration, delay, size]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-lg', className)}
      {...props}
    >
      {children}
      
      {/* Animated border beam */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          'before:absolute before:inset-0',
          'before:rounded-lg',
          'before:border-2 before:border-transparent',
          'before:animate-border-beam',
          'before:opacity-0'
        )}
        style={{
          '--border-beam-color': color,
          animationDuration: `var(--border-beam-duration, ${duration}s)`,
          animationDelay: `var(--border-beam-delay, ${delay}s)`,
        }}
      >
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full animate-border-beam-rotate"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg)`,
            animationDuration: `var(--border-beam-duration, ${duration}s)`,
            animationDelay: `var(--border-beam-delay, ${delay}s)`,
          }}
        />
      </div>
    </div>
  );
};

BorderBeam.displayName = 'BorderBeam';
