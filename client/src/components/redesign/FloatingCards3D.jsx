/**
 * FloatingCards3D Component
 * 
 * Displays animated 3D auction cards for the hero section with:
 * - CSS 3D transforms with perspective
 * - Floating animation using CSS keyframes
 * - Feature detection for 3D support with fallback to 2D
 * - Framer Motion entrance animations with staggered spring physics
 * - Parallax scroll effects using Framer Motion useScroll hook
 * - GPU-accelerated transforms only (translateY for parallax)
 * - Custom animation variants from lib/animations.js
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.5, 8.1, 8.4
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { floatingCardEntrance, floatingCardsContainer } from '../../lib/animations';

/**
 * Feature detection for CSS 3D transform support
 * @returns {boolean} True if browser supports 3D transforms
 */
const supports3D = () => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return false;
  }
  
  try {
    return CSS.supports('transform', 'translateZ(0px)') || 
           CSS.supports('transform', 'translate3d(0, 0, 0)');
  } catch (e) {
    return false;
  }
};

/**
 * FloatingCards3D Component
 * 
 * @param {Object} props
 * @param {Array} props.cards - Array of card objects with id, title, image, currentBid
 * @param {number} [props.animationDelay=100] - Stagger delay between cards in ms
 */
const FloatingCards3D = ({ cards = [], animationDelay = 100 }) => {
  const [has3DSupport, setHas3DSupport] = useState(true);
  const containerRef = useRef(null);

  // Framer Motion useScroll hook for parallax effect
  // Track scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    // Check 3D support on mount
    setHas3DSupport(supports3D());
  }, []);

  // Use custom animation variants from lib/animations.js
  // Customize the variants to use the animationDelay prop
  const customCardVariants = {
    hidden: (index) => floatingCardEntrance.hidden(has3DSupport),
    visible: (index) => ({
      ...floatingCardEntrance.visible(index),
      transition: {
        ...floatingCardEntrance.visible(index).transition,
        delay: index * (animationDelay / 1000),
      }
    })
  };

  // Customize container variants with animationDelay
  const customContainerVariants = {
    ...floatingCardsContainer,
    visible: {
      ...floatingCardsContainer.visible,
      transition: {
        ...floatingCardsContainer.visible.transition,
        staggerChildren: animationDelay / 1000,
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center gap-6 flex-wrap"
      variants={customContainerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Featured auction items"
    >
      {cards.map((card, index) => {
        // Create parallax transforms for each card with different speeds
        // Use GPU-accelerated properties only (translateY)
        const parallaxSpeed = 0.5 + (index * 0.2); // Different speed per card
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -50 * parallaxSpeed] // Move up as user scrolls down
        );

        return (
          <motion.div
            key={card.id}
            custom={index}
            variants={customCardVariants}
            style={{ y }} // Apply parallax transform
            className={`floating-card ${has3DSupport ? 'floating-card-3d' : 'floating-card-2d'}`}
            // Apply 3D perspective if supported
            {...(has3DSupport && {
              style: {
                y, // Keep parallax
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }
            })}
          >
            <div className="card-inner bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {card.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Bid</span>
                  <span className="text-lg font-bold text-primary-500">
                    ${card.currentBid.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* CSS for floating animation */}
      <style jsx>{`
        /* 3D floating animation with CSS transforms */
        .floating-card-3d {
          width: 280px;
          animation: float3d 6s ease-in-out infinite;
        }

        .floating-card-3d:nth-child(2) {
          animation-delay: 1s;
        }

        .floating-card-3d:nth-child(3) {
          animation-delay: 2s;
        }

        @keyframes float3d {
          0%, 100% {
            transform: translateY(0px) rotateX(2deg) rotateY(-2deg) translateZ(20px);
          }
          50% {
            transform: translateY(-20px) rotateX(-2deg) rotateY(2deg) translateZ(40px);
          }
        }

        /* 2D fallback animation */
        .floating-card-2d {
          width: 280px;
          animation: float2d 6s ease-in-out infinite;
        }

        .floating-card-2d:nth-child(2) {
          animation-delay: 1s;
        }

        .floating-card-2d:nth-child(3) {
          animation-delay: 2s;
        }

        @keyframes float2d {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        /* GPU acceleration hint */
        .floating-card {
          will-change: transform;
          backface-visibility: hidden;
        }

        /* Smooth card inner transitions */
        .card-inner {
          transition: transform 0.3s ease-out;
        }

        .floating-card:hover .card-inner {
          transform: translateY(-4px);
        }
      `}</style>
    </motion.div>
  );
};

export default FloatingCards3D;
