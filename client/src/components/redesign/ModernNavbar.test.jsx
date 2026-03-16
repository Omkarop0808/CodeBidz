import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ModernNavbar } from './ModernNavbar';
import authReducer from '../../store/auth/authSlice';

/**
 * Unit Tests for ModernNavbar Component
 * 
 * Tests validate:
 * - Component renders without errors (Requirement 1.1)
 * - Hamburger menu displays on mobile viewport (Requirement 12.3)
 * - Drawer opens/closes on click (Requirement 12.4)
 * - Navigation links are present (Requirement 1.1)
 */

// Mock the useAuction hook
vi.mock('../../hooks/useAuction.js', () => ({
  usePrefetchHandlers: () => ({
    prefetchAuctions: vi.fn(),
    prefetchMyAuctions: vi.fn(),
    prefetchMyBids: vi.fn(),
    prefetchDashboard: vi.fn(),
  }),
}));

// Helper function to create a mock store
const createMockStore = (authState = { user: null }) => {
  return configureStore({
    reducer: {
      auth: (state = authState) => state,
    },
  });
};

// Helper function to render component with providers
const renderWithProviders = (component, { store = createMockStore() } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('ModernNavbar', () => {
  beforeEach(() => {
    // Reset window size before each test
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      renderWithProviders(<ModernNavbar />);
      
      // Check that the logo is present
      expect(screen.getByText('Online Auction')).toBeInTheDocument();
    });

    it('should render the logo with sky blue accent', () => {
      renderWithProviders(<ModernNavbar />);
      
      const logo = screen.getByText('Online Auction');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('font-heading');
    });

    it('should render sticky header with frosted glass effect', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0');
      
      const backdrop = container.querySelector('.backdrop-blur-xl');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Navigation Links - Unauthenticated', () => {
    it('should display navigation links for unauthenticated users', () => {
      renderWithProviders(<ModernNavbar />);
      
      // Desktop navigation should show Home, About, Contact, Legal
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /legal/i })).toBeInTheDocument();
    });

    it('should display Sign In CTA buttons for unauthenticated users', () => {
      renderWithProviders(<ModernNavbar />);
      
      // Should have Log in and Sign up buttons
      const loginButtons = screen.getAllByText('Log in');
      const signupButtons = screen.getAllByText('Sign up');
      
      expect(loginButtons.length).toBeGreaterThan(0);
      expect(signupButtons.length).toBeGreaterThan(0);
    });

    it('should have correct links for auth buttons', () => {
      renderWithProviders(<ModernNavbar />);
      
      const loginLinks = screen.getAllByRole('link', { name: /log in/i });
      const signupLinks = screen.getAllByRole('link', { name: /sign up/i });
      
      expect(loginLinks[0]).toHaveAttribute('href', '/login');
      expect(signupLinks[0]).toHaveAttribute('href', '/signup');
    });
  });

  describe('Navigation Links - Authenticated', () => {
    const mockUser = {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      },
    };

    it('should display navigation links for authenticated users', () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      // Should show Dashboard, Create Auction, Auctions, My Auctions, My Bids
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /create auction/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^auctions$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /my auctions/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /my bids/i })).toBeInTheDocument();
    });

    it('should display user profile information', () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      // Should show user's first name
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('should display user avatar with first letter', () => {
      const store = createMockStore({ user: mockUser });
      const { container } = renderWithProviders(<ModernNavbar />, { store });
      
      // Should show first letter of name in avatar
      const avatars = container.querySelectorAll('.bg-sky-100');
      const hasJLetter = Array.from(avatars).some(el => el.textContent.includes('J'));
      expect(hasJLetter).toBe(true);
    });

    it('should display sign out button for authenticated users', () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      const signOutButton = screen.getByTitle('Sign out');
      expect(signOutButton).toBeInTheDocument();
    });

    it('should display admin panel link for admin users', () => {
      const adminUser = {
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
      };
      const store = createMockStore({ user: adminUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      expect(screen.getByRole('link', { name: /admin panel/i })).toBeInTheDocument();
    });
  });

  describe('Hamburger Menu', () => {
    it('should display hamburger menu button', () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('should have correct aria attributes on hamburger button', () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('should display hamburger icon', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Drawer Functionality', () => {
    it('should open drawer when hamburger menu is clicked', async () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('should close drawer when close button is clicked', async () => {
      renderWithProviders(<ModernNavbar />);
      
      // Open drawer
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
      
      // Close drawer
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
      });
    });

    it('should close drawer when overlay is clicked', async () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      // Open drawer
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
      
      // Click overlay
      const overlay = container.querySelector('.bg-black\\/40');
      if (overlay) {
        fireEvent.click(overlay);
        
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
        });
      }
    });

    it('should update aria-expanded when drawer opens', async () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should prevent body scroll when drawer is open', async () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('should restore body scroll when drawer is closed', async () => {
      renderWithProviders(<ModernNavbar />);
      
      // Open drawer
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
      
      // Close drawer
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  describe('Drawer Content - Unauthenticated', () => {
    it('should display all navigation links in drawer for unauthenticated users', async () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /legal/i }).length).toBeGreaterThan(0);
      });
    });

    it('should display auth buttons in drawer for unauthenticated users', async () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const loginLinks = screen.getAllByRole('link', { name: /log in/i });
        const signupLinks = screen.getAllByRole('link', { name: /sign up/i });
        
        expect(loginLinks.length).toBeGreaterThan(0);
        expect(signupLinks.length).toBeGreaterThan(0);
      });
    });

    it('should close drawer when navigation link is clicked', async () => {
      renderWithProviders(<ModernNavbar />);
      
      // Open drawer
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
      
      // Click a navigation link in the drawer
      const drawerLinks = screen.getAllByRole('link', { name: /home/i });
      const drawerHomeLink = drawerLinks.find(link => 
        link.closest('.fixed') !== null
      );
      
      if (drawerHomeLink) {
        fireEvent.click(drawerHomeLink);
        
        await waitFor(() => {
          expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Drawer Content - Authenticated', () => {
    const mockUser = {
      user: {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
      },
    };

    it('should display user profile in drawer for authenticated users', async () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });
    });

    it('should display sign out button in drawer for authenticated users', async () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        const signOutButtons = screen.getAllByText('Sign out');
        expect(signOutButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display all navigation links in drawer for authenticated users', async () => {
      const store = createMockStore({ user: mockUser });
      renderWithProviders(<ModernNavbar />, { store });
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /create auction/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /profile/i }).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should always display hamburger menu button', () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('should have proper mobile-responsive classes', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      // Check for responsive classes
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      renderWithProviders(<ModernNavbar />);
      
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toHaveAttribute('aria-label');
    });

    it('should have semantic header element', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have semantic nav element', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should have focus styles on interactive elements', () => {
      renderWithProviders(<ModernNavbar />);
      
      const loginLinks = screen.getAllByRole('link', { name: /log in/i });
      if (loginLinks.length > 0) {
        expect(loginLinks[0]).toHaveClass('focus:outline-none', 'focus:ring-2');
      }
    });
  });

  describe('Logo and Branding', () => {
    it('should render logo with link to home', () => {
      renderWithProviders(<ModernNavbar />);
      
      const logoLinks = screen.getAllByRole('link', { name: /online auction/i });
      expect(logoLinks[0]).toHaveAttribute('href', '/');
    });

    it('should have sky blue accent on logo icon', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const logoIcon = container.querySelector('.bg-sky-400');
      expect(logoIcon).toBeInTheDocument();
    });

    it('should have hover effect on logo', () => {
      const { container } = renderWithProviders(<ModernNavbar />);
      
      const logoIcon = container.querySelector('.group-hover\\:bg-sky-500');
      expect(logoIcon).toBeInTheDocument();
    });
  });
});

/**
 * Property-Based Tests for ModernNavbar Component
 * 
 * These tests use fast-check to verify universal properties across
 * a wide range of inputs and scenarios.
 */

import * as fc from 'fast-check';

describe('Property-Based Tests', () => {
  describe('Property 30: Sticky Navigation Bar', () => {
    /**
     * **Validates: Requirements 12.1**
     * 
     * Property: For any scroll position, the navigation bar should remain 
     * fixed at the top of the viewport.
     * 
     * This test verifies that regardless of scroll position, the navbar
     * maintains its sticky positioning at the top of the viewport.
     */
    it('should remain fixed at the top of viewport for any scroll position', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary scroll positions (0 to 10000px)
          fc.integer({ min: 0, max: 10000 }),
          (scrollPosition) => {
            // Render the component
            const { container } = renderWithProviders(<ModernNavbar />);
            
            // Get the header element
            const header = container.querySelector('header');
            
            // Verify header exists
            expect(header).toBeInTheDocument();
            
            // Verify sticky positioning classes are present
            expect(header).toHaveClass('sticky');
            expect(header).toHaveClass('top-0');
            
            // Verify z-index is set to keep navbar above content
            expect(header).toHaveClass('z-40');
            
            // Simulate scroll by setting window.scrollY
            Object.defineProperty(window, 'scrollY', {
              writable: true,
              configurable: true,
              value: scrollPosition,
            });
            
            // Verify the header still has sticky positioning after scroll
            expect(header).toHaveClass('sticky');
            expect(header).toHaveClass('top-0');
            
            // Verify the computed style would keep it at the top
            // In a real browser, sticky positioning keeps the element at top: 0
            // when scrolling, which is what we're testing with the classes
            const styles = window.getComputedStyle(header);
            
            // The position should be sticky (or -webkit-sticky for older browsers)
            // Note: jsdom doesn't fully support sticky positioning, so we verify
            // the classes are present which would result in sticky behavior
            expect(header.classList.contains('sticky')).toBe(true);
            expect(header.classList.contains('top-0')).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 } // Run 100 iterations with different scroll positions
      );
    });

    it('should maintain frosted glass backdrop effect at any scroll position', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary scroll positions
          fc.integer({ min: 0, max: 10000 }),
          (scrollPosition) => {
            const { container } = renderWithProviders(<ModernNavbar />);
            
            // Simulate scroll
            Object.defineProperty(window, 'scrollY', {
              writable: true,
              configurable: true,
              value: scrollPosition,
            });
            
            // Verify frosted glass effect is present
            const backdrop = container.querySelector('.backdrop-blur-xl');
            expect(backdrop).toBeInTheDocument();
            
            // Verify the backdrop has the correct styling
            expect(backdrop).toHaveClass('bg-white/80');
            expect(backdrop).toHaveClass('backdrop-blur-xl');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain z-index stacking context at any scroll position', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary scroll positions
          fc.integer({ min: 0, max: 10000 }),
          (scrollPosition) => {
            const { container } = renderWithProviders(<ModernNavbar />);
            
            // Simulate scroll
            Object.defineProperty(window, 'scrollY', {
              writable: true,
              configurable: true,
              value: scrollPosition,
            });
            
            // Get the header element
            const header = container.querySelector('header');
            
            // Verify z-index class is present to ensure navbar stays above content
            expect(header).toHaveClass('z-40');
            
            // Verify the header is still at the top of the DOM structure
            expect(header.parentElement).toBeTruthy();
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve sticky positioning with different viewport widths', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary scroll positions and viewport widths
          fc.integer({ min: 0, max: 10000 }),
          fc.integer({ min: 320, max: 2560 }),
          (scrollPosition, viewportWidth) => {
            // Set viewport width
            window.innerWidth = viewportWidth;
            
            const { container } = renderWithProviders(<ModernNavbar />);
            
            // Simulate scroll
            Object.defineProperty(window, 'scrollY', {
              writable: true,
              configurable: true,
              value: scrollPosition,
            });
            
            // Get the header element
            const header = container.querySelector('header');
            
            // Verify sticky positioning is maintained regardless of viewport width
            expect(header).toHaveClass('sticky');
            expect(header).toHaveClass('top-0');
            expect(header).toHaveClass('z-40');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
