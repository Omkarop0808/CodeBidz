/**
 * Animation Variants Library
 * Reusable Framer Motion animation configurations
 * 
 * This library provides consistent animation variants across the application
 * using Framer Motion. All animations use GPU-accelerated properties (transform, opacity)
 * for optimal 60fps performance.
 */

// Fade in from bottom with upward motion
export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1], // easeInOut
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

// Stagger container for sequential animations
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Scale in animation with spring physics
export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// Slide in from right (for mobile drawer)
export const slideInFromRight = {
  initial: {
    x: '100%',
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1], // easeOut
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1], // easeIn
    },
  },
};

// Drawer variants for mobile navigation
export const drawerVariants = {
  closed: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  },
};

// Overlay variants for backdrop
export const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Fade in animation (simple)
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Slide in from left
export const slideInFromLeft = {
  initial: {
    x: '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1],
    },
  },
};

// Hover scale animation
export const hoverScale = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    },
  },
};

// Card entrance animation with stagger
export const cardEntrance = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Floating animation (for 3D cards)
export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Page transition
export const pageTransition = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Scroll-triggered animation
export const scrollReveal = {
  initial: {
    opacity: 0,
    y: 50,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  viewport: {
    once: true,
    margin: '-100px',
  },
};

// Floating card entrance with spring physics and 3D support
// Used for hero section 3D cards with staggered entrance
export const floatingCardEntrance = {
  hidden: (has3DSupport) => ({
    opacity: 0,
    y: 50,
    rotateX: has3DSupport ? -15 : 0,
    scale: 0.9,
  }),
  visible: (index) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  }),
};

// Container for staggered floating cards
export const floatingCardsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default {
  fadeInUp,
  staggerContainer,
  scaleIn,
  slideInFromRight,
  drawerVariants,
  overlayVariants,
  fadeIn,
  slideInFromLeft,
  hoverScale,
  cardEntrance,
  floatingAnimation,
  pageTransition,
  scrollReveal,
  floatingCardEntrance,
  floatingCardsContainer,
};
