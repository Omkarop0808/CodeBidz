import { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * ShimmerButton Component
 * 
 * A button with an animated shimmer effect that travels across on hover.
 * Uses GPU-accelerated transforms for smooth performance.
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.shimmerColor - Shimmer highlight color (default: white)
 * @param {number} props.shimmerDuration - Animation duration in seconds (default: 2)
 * @param {boolean} props.disabled - Whether button is disabled
 */
export const ShimmerButton = ({
  className,
  children,
  shimmerColor = 'rgba(255, 255, 255, 0.5)',
  shimmerDuration = 2,
  disabled = false,
  ...props
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !buttonRef.current) {
      return;
    }

    const element = buttonRef.current;
    element.style.setProperty('--shimmer-duration', `${shimmerDuration}s`);
  }, [shimmerDuration]);

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden',
        'px-6 py-3 rounded-lg',
        'bg-primary-400 text-white font-medium',
        'transition-all duration-300',
        'hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-200/50',
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'group',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer effect */}
      <span
        className={cn(
          'absolute inset-0 -translate-x-full',
          'bg-gradient-to-r from-transparent via-white/30 to-transparent',
          'group-hover:animate-shimmer',
          'pointer-events-none'
        )}
        style={{
          animationDuration: `var(--shimmer-duration, ${shimmerDuration}s)`,
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

ShimmerButton.displayName = 'ShimmerButton';
