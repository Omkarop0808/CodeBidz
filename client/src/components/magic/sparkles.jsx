import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * Sparkles Component
 * 
 * Creates animated sparkle effects around child elements.
 * Uses GPU-accelerated transforms and opacity for smooth performance.
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Sparkle color (default: sky blue)
 * @param {number} props.count - Number of sparkles (default: 5)
 * @param {React.ReactNode} props.children - Child elements to render with sparkles
 */
export const Sparkles = ({
  className,
  color = '#38bdf8',
  count = 5,
  children,
  ...props
}) => {
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setSparkles([]);
      return;
    }

    // Generate sparkle positions and delays
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1,
      size: 4 + Math.random() * 4,
    }));

    setSparkles(newSparkles);
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      {...props}
    >
      {children}
      
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute pointer-events-none animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill={color}
            />
          </svg>
        </span>
      ))}
    </div>
  );
};

Sparkles.displayName = 'Sparkles';
