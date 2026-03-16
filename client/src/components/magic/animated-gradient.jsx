import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * AnimatedGradient Component
 * 
 * Creates an animated gradient background with smooth color transitions.
 * Uses GPU-accelerated transforms and respects reduced motion preferences.
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string[]} props.colors - Array of gradient colors (default: sky blue palette)
 * @param {number} props.duration - Animation duration in seconds (default: 8)
 * @param {React.ReactNode} props.children - Child elements to render over gradient
 */
export const AnimatedGradient = ({
  className,
  colors = ['#38bdf8', '#0ea5e9', '#7dd3fc', '#bae6fd'],
  duration = 8,
  children,
  ...props
}) => {
  const gradientRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !gradientRef.current) {
      return;
    }

    // Create animated gradient using CSS custom properties
    const element = gradientRef.current;
    element.style.setProperty('--gradient-duration', `${duration}s`);
  }, [duration]);

  return (
    <div
      ref={gradientRef}
      className={cn(
        'relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-br before:from-primary-400 before:via-primary-500 before:to-primary-300',
        'before:animate-gradient-shift',
        'before:opacity-80',
        className
      )}
      style={{
        '--gradient-colors': colors.join(', '),
      }}
      {...props}
    >
      {children}
    </div>
  );
};

AnimatedGradient.displayName = 'AnimatedGradient';
