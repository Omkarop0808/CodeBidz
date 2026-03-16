import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * BeamEffect Component
 * 
 * Creates an animated beam effect that travels across the element.
 * Uses GPU-accelerated transforms for smooth 60fps animation.
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Beam color (default: sky blue)
 * @param {number} props.duration - Animation duration in seconds (default: 3)
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 * @param {'horizontal' | 'vertical'} props.direction - Beam direction (default: 'horizontal')
 */
export const BeamEffect = ({
  className,
  color = '#38bdf8',
  duration = 3,
  delay = 0,
  direction = 'horizontal',
  ...props
}) => {
  const beamRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !beamRef.current) {
      return;
    }

    const element = beamRef.current;
    element.style.setProperty('--beam-duration', `${duration}s`);
    element.style.setProperty('--beam-delay', `${delay}s`);
  }, [duration, delay]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={beamRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute',
          isHorizontal ? 'h-full w-1/3 -left-1/3' : 'w-full h-1/3 -top-1/3',
          'animate-beam-slide',
          'opacity-0'
        )}
        style={{
          background: isHorizontal
            ? `linear-gradient(90deg, transparent, ${color}, transparent)`
            : `linear-gradient(180deg, transparent, ${color}, transparent)`,
          animationDuration: `var(--beam-duration, ${duration}s)`,
          animationDelay: `var(--beam-delay, ${delay}s)`,
        }}
      />
    </div>
  );
};

BeamEffect.displayName = 'BeamEffect';
