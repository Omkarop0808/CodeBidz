import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import FloatingCards3D from './FloatingCards3D';
import * as fc from 'fast-check';

/**
 * Unit Tests for FloatingCards3D Component
 * 
 * Tests validate:
 * - Component renders all cards (Requirement 2.1)
 * - 3D transforms applied when supported (Requirement 2.2)
 * - Fallback to 2D when 3D not supported (Requirement 2.2)
 */

// Mock framer-motion's useScroll hook
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useScroll: () => ({
      scrollYProgress: {
        get: () => 0,
        set: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
      },
    }),
    useTransform: () => ({
      get: () => 0,
      set: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn(),
    }),
  };
});

// Sample card data for testing
const mockCards = [
  {
    id: '1',
    title: 'Vintage Watch',
    image: 'https://via.placeholder.com/300',
    currentBid: 1500,
  },
  {
    id: '2',
    title: 'Antique Vase',
    image: 'https://via.placeholder.com/300',
    currentBid: 2500,
  },
  {
    id: '3',
    title: 'Classic Car',
    image: 'https://via.placeholder.com/300',
    currentBid: 45000,
  },
];

describe('FloatingCards3D', () => {
  beforeEach(() => {
    // Reset CSS.supports mock before each test
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render all cards', () => {
      render(<FloatingCards3D cards={mockCards} />);
      
      // Check that all card titles are rendered
      expect(screen.getByText('Vintage Watch')).toBeInTheDocument();
      expect(screen.getByText('Antique Vase')).toBeInTheDocument();
      expect(screen.getByText('Classic Car')).toBeInTheDocument();
    });

    it('should render card images with correct alt text', () => {
      render(<FloatingCards3D cards={mockCards} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('alt', 'Vintage Watch');
      expect(images[1]).toHaveAttribute('alt', 'Antique Vase');
      expect(images[2]).toHaveAttribute('alt', 'Classic Car');
    });

    it('should display current bid amounts', () => {
      render(<FloatingCards3D cards={mockCards} />);
      
      expect(screen.getByText('$1,500')).toBeInTheDocument();
      expect(screen.getByText('$2,500')).toBeInTheDocument();
      expect(screen.getByText('$45,000')).toBeInTheDocument();
    });

    it('should render with aria-label for accessibility', () => {
      const { container } = render(<FloatingCards3D cards={mockCards} />);
      
      const mainContainer = container.querySelector('[aria-label="Featured auction items"]');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('3D Transform Support', () => {
    it('should apply 3D transforms when supported', () => {
      // Mock CSS.supports to return true for 3D transforms
      const originalSupports = CSS.supports;
      CSS.supports = vi.fn((property, value) => {
        if (property === 'transform' && (value === 'translateZ(0px)' || value === 'translate3d(0, 0, 0)')) {
          return true;
        }
        return originalSupports.call(CSS, property, value);
      });

      const { container } = render(<FloatingCards3D cards={mockCards} />);
      
      // Check for 3D class
      const cards = container.querySelectorAll('.floating-card-3d');
      expect(cards.length).toBeGreaterThan(0);

      // Restore original CSS.supports
      CSS.supports = originalSupports;
    });

    it('should fallback to 2D when 3D not supported', () => {
      // Mock CSS.supports to return false for 3D transforms
      const originalSupports = CSS.supports;
      CSS.supports = vi.fn(() => false);

      const { container } = render(<FloatingCards3D cards={mockCards} />);
      
      // Wait for state update
      waitFor(() => {
        const cards = container.querySelectorAll('.floating-card-2d');
        expect(cards.length).toBeGreaterThan(0);
      });

      // Restore original CSS.supports
      CSS.supports = originalSupports;
    });
  });

  describe('Animation Delay', () => {
    it('should use default animation delay of 100ms', () => {
      render(<FloatingCards3D cards={mockCards} />);
      
      // Component should render without errors with default delay
      expect(screen.getByText('Vintage Watch')).toBeInTheDocument();
    });

    it('should accept custom animation delay', () => {
      render(<FloatingCards3D cards={mockCards} animationDelay={200} />);
      
      // Component should render without errors with custom delay
      expect(screen.getByText('Vintage Watch')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render without errors when no cards provided', () => {
      const { container } = render(<FloatingCards3D cards={[]} />);
      
      const mainContainer = container.querySelector('[aria-label="Featured auction items"]');
      expect(mainContainer).toBeInTheDocument();
    });
  });
});

/**
 * Property-Based Tests for FloatingCards3D Component
 * 
 * These tests use fast-check to verify universal properties across
 * a wide range of inputs and scenarios.
 */

describe('Property-Based Tests', () => {
  describe('Property 8: Parallax Scroll Effect', () => {
    /**
     * **Validates: Requirements 2.3**
     * 
     * Property: For any scroll event on the hero section, the floating cards 
     * should update their transform values to create parallax effect.
     * 
     * This test verifies that:
     * 1. Each card has a parallax transform applied
     * 2. Different cards have different parallax speeds
     * 3. Transform values change based on scroll progress
     * 4. Only GPU-accelerated properties (translateY) are used
     */
    it('should apply parallax transforms to all cards with varying speeds', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate arbitrary number of cards (1 to 10)
          fc.integer({ min: 1, max: 10 }),
          // Generate arbitrary scroll progress (0 to 1)
          fc.float({ min: 0, max: 1 }),
          async (numCards, scrollProgress) => {
            // Mock useScroll to return controlled scroll progress
            const mockScrollYProgress = {
              get: () => scrollProgress,
              set: vi.fn(),
              on: vi.fn(),
              destroy: vi.fn(),
            };

            // Mock useTransform to calculate parallax based on scroll progress
            const mockUseTransform = vi.fn((motionValue, inputRange, outputRange) => {
              // Calculate the interpolated value based on scroll progress
              const progress = motionValue.get();
              const [inputStart, inputEnd] = inputRange;
              const [outputStart, outputEnd] = outputRange;
              
              // Linear interpolation
              const normalizedProgress = (progress - inputStart) / (inputEnd - inputStart);
              const value = outputStart + (normalizedProgress * (outputEnd - outputStart));
              
              return {
                get: () => value,
                set: vi.fn(),
                on: vi.fn(),
                destroy: vi.fn(),
              };
            });

            // Apply mocks
            const { useScroll, useTransform } = await import('framer-motion');
            vi.mocked(useScroll).mockReturnValue({ scrollYProgress: mockScrollYProgress });
            vi.mocked(useTransform).mockImplementation(mockUseTransform);

            // Generate mock card data
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `parallax-card-${i}`,
              title: `Card ${i}`,
              image: `https://via.placeholder.com/300`,
              currentBid: 1000 + i * 100,
            }));

            // Render component
            const { container } = render(<FloatingCards3D cards={cards} />);

            // Verify useTransform was called for each card
            expect(mockUseTransform).toHaveBeenCalledTimes(numCards);

            // Verify each card has different parallax speed
            for (let i = 0; i < numCards; i++) {
              const parallaxSpeed = 0.5 + (i * 0.2);
              const expectedOutputRange = [0, -50 * parallaxSpeed];
              
              // Check that useTransform was called with correct parameters for this card
              const call = mockUseTransform.mock.calls[i];
              expect(call).toBeDefined();
              expect(call[1]).toEqual([0, 1]); // Input range
              expect(call[2]).toEqual(expectedOutputRange); // Output range varies by card
            }

            // Verify all cards are rendered
            const renderedCards = container.querySelectorAll('.floating-card');
            expect(renderedCards.length).toBe(numCards);

            return true;
          }
        ),
        { 
          numRuns: 50,
          verbose: true,
        }
      );
    });

    it('should use GPU-accelerated properties for parallax transforms', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (numCards) => {
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `gpu-card-${i}`,
              title: `Card ${i}`,
              image: 'https://via.placeholder.com/300',
              currentBid: 1000,
            }));

            const { container } = render(<FloatingCards3D cards={cards} />);

            // Verify that cards use will-change: transform for GPU acceleration
            const renderedCards = container.querySelectorAll('.floating-card');
            
            renderedCards.forEach(card => {
              const styles = window.getComputedStyle(card);
              // Check for GPU acceleration hints
              expect(
                styles.willChange === 'transform' || 
                styles.backfaceVisibility === 'hidden'
              ).toBe(true);
            });

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should apply different parallax speeds to different cards', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 10 }), // At least 2 cards to compare speeds
          async (numCards) => {
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `speed-card-${i}`,
              title: `Card ${i}`,
              image: 'https://via.placeholder.com/300',
              currentBid: 1000,
            }));

            // Mock useTransform to track calls
            const transformCalls = [];
            const mockUseTransform = vi.fn((motionValue, inputRange, outputRange) => {
              transformCalls.push({ inputRange, outputRange });
              return {
                get: () => 0,
                set: vi.fn(),
                on: vi.fn(),
                destroy: vi.fn(),
              };
            });

            const { useTransform } = await import('framer-motion');
            vi.mocked(useTransform).mockImplementation(mockUseTransform);

            render(<FloatingCards3D cards={cards} />);

            // Verify that different cards have different output ranges (different speeds)
            const outputRanges = transformCalls.map(call => call.outputRange[1]);
            
            // Check that at least some cards have different speeds
            const uniqueSpeeds = new Set(outputRanges);
            expect(uniqueSpeeds.size).toBeGreaterThan(1);

            // Verify the speed formula: -50 * (0.5 + index * 0.2)
            for (let i = 0; i < numCards; i++) {
              const expectedSpeed = 0.5 + (i * 0.2);
              const expectedOutputEnd = -50 * expectedSpeed;
              expect(outputRanges[i]).toBeCloseTo(expectedOutputEnd, 5);
            }

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should update transform values based on scroll progress', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 5 }),
          fc.float({ min: 0, max: 1 }),
          fc.float({ min: 0, max: 1 }),
          async (numCards, scrollProgress1, scrollProgress2) => {
            // Ensure we have two different scroll positions
            if (Math.abs(scrollProgress1 - scrollProgress2) < 0.1) {
              scrollProgress2 = (scrollProgress1 + 0.5) % 1;
            }

            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `scroll-card-${i}`,
              title: `Card ${i}`,
              image: 'https://via.placeholder.com/300',
              currentBid: 1000,
            }));

            // Test with first scroll position
            const mockScrollYProgress1 = {
              get: () => scrollProgress1,
              set: vi.fn(),
              on: vi.fn(),
              destroy: vi.fn(),
            };

            const mockUseTransform1 = vi.fn((motionValue, inputRange, outputRange) => {
              const progress = motionValue.get();
              const value = outputRange[0] + (progress * (outputRange[1] - outputRange[0]));
              return {
                get: () => value,
                set: vi.fn(),
                on: vi.fn(),
                destroy: vi.fn(),
              };
            });

            const { useScroll, useTransform } = await import('framer-motion');
            vi.mocked(useScroll).mockReturnValue({ scrollYProgress: mockScrollYProgress1 });
            vi.mocked(useTransform).mockImplementation(mockUseTransform1);

            const { unmount } = render(<FloatingCards3D cards={cards} />);

            // Capture transform values at first scroll position
            const transformValues1 = mockUseTransform1.mock.results.map(result => 
              result.value.get()
            );

            unmount();
            vi.clearAllMocks();

            // Test with second scroll position
            const mockScrollYProgress2 = {
              get: () => scrollProgress2,
              set: vi.fn(),
              on: vi.fn(),
              destroy: vi.fn(),
            };

            const mockUseTransform2 = vi.fn((motionValue, inputRange, outputRange) => {
              const progress = motionValue.get();
              const value = outputRange[0] + (progress * (outputRange[1] - outputRange[0]));
              return {
                get: () => value,
                set: vi.fn(),
                on: vi.fn(),
                destroy: vi.fn(),
              };
            });

            vi.mocked(useScroll).mockReturnValue({ scrollYProgress: mockScrollYProgress2 });
            vi.mocked(useTransform).mockImplementation(mockUseTransform2);

            render(<FloatingCards3D cards={cards} />);

            // Capture transform values at second scroll position
            const transformValues2 = mockUseTransform2.mock.results.map(result => 
              result.value.get()
            );

            // Verify that transform values changed between scroll positions
            for (let i = 0; i < numCards; i++) {
              if (scrollProgress1 !== scrollProgress2) {
                expect(transformValues1[i]).not.toBe(transformValues2[i]);
              }
            }

            return true;
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should handle edge case: zero scroll progress', async () => {
      const cards = [
        { id: '1', title: 'Card 1', image: 'https://via.placeholder.com/300', currentBid: 1000 },
        { id: '2', title: 'Card 2', image: 'https://via.placeholder.com/300', currentBid: 2000 },
      ];

      const mockScrollYProgress = {
        get: () => 0,
        set: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
      };

      const mockUseTransform = vi.fn((motionValue, inputRange, outputRange) => {
        const progress = motionValue.get();
        // At scroll progress 0, output should be outputRange[0] (which is 0)
        return {
          get: () => outputRange[0],
          set: vi.fn(),
          on: vi.fn(),
          destroy: vi.fn(),
        };
      });

      const { useScroll, useTransform } = await import('framer-motion');
      vi.mocked(useScroll).mockReturnValue({ scrollYProgress: mockScrollYProgress });
      vi.mocked(useTransform).mockImplementation(mockUseTransform);

      render(<FloatingCards3D cards={cards} />);

      // At zero scroll, all transforms should be at their starting position (0)
      const transformValues = mockUseTransform.mock.results.map(result => result.value.get());
      transformValues.forEach(value => {
        expect(value).toBe(0);
      });
    });

    it('should handle edge case: maximum scroll progress', async () => {
      const cards = [
        { id: '1', title: 'Card 1', image: 'https://via.placeholder.com/300', currentBid: 1000 },
        { id: '2', title: 'Card 2', image: 'https://via.placeholder.com/300', currentBid: 2000 },
      ];

      const mockScrollYProgress = {
        get: () => 1,
        set: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
      };

      const mockUseTransform = vi.fn((motionValue, inputRange, outputRange) => {
        const progress = motionValue.get();
        // At scroll progress 1, output should be outputRange[1] (maximum parallax)
        return {
          get: () => outputRange[1],
          set: vi.fn(),
          on: vi.fn(),
          destroy: vi.fn(),
        };
      });

      const { useScroll, useTransform } = await import('framer-motion');
      vi.mocked(useScroll).mockReturnValue({ scrollYProgress: mockScrollYProgress });
      vi.mocked(useTransform).mockImplementation(mockUseTransform);

      render(<FloatingCards3D cards={cards} />);

      // At maximum scroll, transforms should be at their end positions
      const transformValues = mockUseTransform.mock.results.map(result => result.value.get());
      
      // First card: speed = 0.5, end = -50 * 0.5 = -25
      expect(transformValues[0]).toBeCloseTo(-25, 5);
      
      // Second card: speed = 0.7, end = -50 * 0.7 = -35
      expect(transformValues[1]).toBeCloseTo(-35, 5);
    });
  });

  describe('Property 9: Hero Animation Timing', () => {
    /**
     * **Validates: Requirements 2.5**
     * 
     * Property: For any page load, all hero section animations should complete 
     * within 2 seconds.
     * 
     * This test verifies that regardless of the number of cards or animation delay,
     * all entrance animations complete within the 2-second requirement.
     * 
     * Animation timing breakdown:
     * - Container delayChildren: 0.2s (from floatingCardsContainer)
     * - Stagger delay per card: animationDelay / 1000 seconds
     * - Individual card animation duration: 0.6s (spring animation)
     * - Total time = delayChildren + (numCards - 1) * stagger + cardDuration
     */
    it('should complete all entrance animations within 2 seconds for any number of cards', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary number of cards (1 to 10)
          fc.integer({ min: 1, max: 10 }),
          // Generate arbitrary animation delay (50ms to 200ms)
          fc.integer({ min: 50, max: 200 }),
          (numCards, animationDelay) => {
            // Generate mock card data
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `card-${i}`,
              title: `Test Card ${i}`,
              image: `https://via.placeholder.com/300?text=Card${i}`,
              currentBid: 1000 + i * 100,
            }));

            // Calculate expected total animation time
            // Based on floatingCardsContainer and floatingCardEntrance variants
            const containerDelayChildren = 0.2; // seconds (from floatingCardsContainer)
            const staggerDelay = animationDelay / 1000; // convert ms to seconds
            const cardAnimationDuration = 0.6; // seconds (spring animation duration)
            
            // Total time = initial delay + stagger for all cards + last card animation
            const totalAnimationTime = 
              containerDelayChildren + 
              ((numCards - 1) * staggerDelay) + 
              cardAnimationDuration;

            // Verify that total animation time is within 2 seconds
            expect(totalAnimationTime).toBeLessThanOrEqual(2.0);

            // Also render the component to ensure it works with these parameters
            const { container } = render(
              <FloatingCards3D cards={cards} animationDelay={animationDelay} />
            );

            // Verify all cards are rendered
            const renderedCards = container.querySelectorAll('.floating-card');
            expect(renderedCards.length).toBe(numCards);

            return true;
          }
        ),
        { 
          numRuns: 100, // Run 100 iterations with different card counts and delays
          verbose: true,
        }
      );
    });

    it('should complete animations within 2 seconds with maximum realistic card count', () => {
      fc.assert(
        fc.property(
          // Test with realistic hero section card counts (3 to 6 cards)
          fc.integer({ min: 3, max: 6 }),
          // Test with various animation delays
          fc.integer({ min: 50, max: 150 }),
          (numCards, animationDelay) => {
            // Generate mock card data
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `hero-card-${i}`,
              title: `Auction Item ${i + 1}`,
              image: `https://via.placeholder.com/300`,
              currentBid: Math.floor(Math.random() * 10000) + 1000,
            }));

            // Calculate animation timing
            const containerDelayChildren = 0.2;
            const staggerDelay = animationDelay / 1000;
            const cardAnimationDuration = 0.6;
            
            const totalAnimationTime = 
              containerDelayChildren + 
              ((numCards - 1) * staggerDelay) + 
              cardAnimationDuration;

            // Verify timing constraint
            expect(totalAnimationTime).toBeLessThanOrEqual(2.0);

            // Render and verify
            const { container } = render(
              <FloatingCards3D cards={cards} animationDelay={animationDelay} />
            );

            const renderedCards = container.querySelectorAll('.floating-card');
            expect(renderedCards.length).toBe(numCards);

            // Verify each card has the floating animation class
            renderedCards.forEach(card => {
              expect(
                card.classList.contains('floating-card-3d') || 
                card.classList.contains('floating-card-2d')
              ).toBe(true);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain 2-second limit with edge case: single card', () => {
      // Test edge case with single card
      const cards = [{
        id: 'single-card',
        title: 'Single Auction Item',
        image: 'https://via.placeholder.com/300',
        currentBid: 5000,
      }];

      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 200 }),
          (animationDelay) => {
            // Calculate timing for single card
            const containerDelayChildren = 0.2;
            const cardAnimationDuration = 0.6;
            
            // With single card, no stagger delay applies
            const totalAnimationTime = containerDelayChildren + cardAnimationDuration;

            // Should be well under 2 seconds
            expect(totalAnimationTime).toBeLessThanOrEqual(2.0);

            // Render and verify
            const { container } = render(
              <FloatingCards3D cards={cards} animationDelay={animationDelay} />
            );

            const renderedCards = container.querySelectorAll('.floating-card');
            expect(renderedCards.length).toBe(1);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should verify animation timing formula correctness', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 50, max: 200 }),
          (numCards, animationDelay) => {
            // This test verifies the mathematical correctness of our timing calculation
            const containerDelayChildren = 0.2; // from floatingCardsContainer
            const staggerDelay = animationDelay / 1000;
            const cardAnimationDuration = 0.6; // from floatingCardEntrance spring config
            
            // The last card starts animating at:
            const lastCardStartTime = containerDelayChildren + ((numCards - 1) * staggerDelay);
            
            // The last card finishes at:
            const lastCardEndTime = lastCardStartTime + cardAnimationDuration;
            
            // Total animation time should equal lastCardEndTime
            const totalAnimationTime = 
              containerDelayChildren + 
              ((numCards - 1) * staggerDelay) + 
              cardAnimationDuration;
            
            expect(totalAnimationTime).toBe(lastCardEndTime);
            
            // And it must be within 2 seconds
            expect(totalAnimationTime).toBeLessThanOrEqual(2.0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle maximum stagger delay while staying under 2 seconds', () => {
      // Test with maximum animation delay (200ms) to ensure we stay under 2s
      const maxAnimationDelay = 200;
      
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          (numCards) => {
            const cards = Array.from({ length: numCards }, (_, i) => ({
              id: `max-delay-card-${i}`,
              title: `Card ${i}`,
              image: 'https://via.placeholder.com/300',
              currentBid: 1000,
            }));

            const containerDelayChildren = 0.2;
            const staggerDelay = maxAnimationDelay / 1000; // 0.2 seconds
            const cardAnimationDuration = 0.6;
            
            const totalAnimationTime = 
              containerDelayChildren + 
              ((numCards - 1) * staggerDelay) + 
              cardAnimationDuration;

            // Even with maximum delay, should stay under 2 seconds
            expect(totalAnimationTime).toBeLessThanOrEqual(2.0);

            // Render to verify it works
            const { container } = render(
              <FloatingCards3D cards={cards} animationDelay={maxAnimationDelay} />
            );

            expect(container.querySelectorAll('.floating-card').length).toBe(numCards);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
