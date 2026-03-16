/**
 * Utility Functions
 * Helper functions for common operations
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class string
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * // Returns: 'py-1 bg-blue-500 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Check if device supports 3D transforms
 * Used for feature detection with fallback to 2D
 * 
 * @returns {boolean} True if 3D transforms are supported
 */
export function supports3D() {
  if (typeof window === 'undefined') return false;
  
  const el = document.createElement('div');
  const transforms = {
    'webkitTransform': '-webkit-transform',
    'msTransform': '-ms-transform',
    'transform': 'transform'
  };

  for (const t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = 'translate3d(1px,1px,1px)';
      const has3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      return has3D !== undefined && has3D.length > 0 && has3D !== 'none';
    }
  }
  
  return false;
}

/**
 * Check if user prefers reduced motion
 * Used for accessibility - disable/reduce animations when preferred
 * 
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get viewport width category
 * Returns the current responsive breakpoint
 * 
 * @returns {'mobile' | 'tablet' | 'desktop' | 'wide'} Current breakpoint
 */
export function getViewportCategory() {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1280) return 'tablet';
  if (width < 1536) return 'desktop';
  return 'wide';
}

/**
 * Debounce function
 * Delays function execution until after wait time has elapsed since last call
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * Ensures function is called at most once per specified time period
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Monitor animation performance
 * Logs warning if FPS drops below threshold (development only)
 * 
 * @param {string} animationName - Name of animation being monitored
 * @param {number} threshold - FPS threshold (default: 55)
 */
export function monitorAnimationPerformance(animationName, threshold = 55) {
  if (process.env.NODE_ENV !== 'development') return;
  
  let lastTime = performance.now();
  let frames = 0;
  let fps = 60;
  
  function checkFPS() {
    const currentTime = performance.now();
    frames++;
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      frames = 0;
      lastTime = currentTime;
      
      if (fps < threshold) {
        console.warn(`[Performance] ${animationName}: FPS dropped to ${fps}`);
      }
    }
    
    requestAnimationFrame(checkFPS);
  }
  
  requestAnimationFrame(checkFPS);
}

/**
 * Format currency
 * Formats number as currency string
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Clamp number between min and max
 * 
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default {
  cn,
  supports3D,
  prefersReducedMotion,
  getViewportCategory,
  debounce,
  throttle,
  monitorAnimationPerformance,
  formatCurrency,
  clamp,
};
