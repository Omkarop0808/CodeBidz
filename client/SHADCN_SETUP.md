# shadcn/ui Setup Documentation

## Overview

This project has been configured to use shadcn/ui components with Tailwind CSS 4.x. The setup follows the modern CSS-first approach while maintaining compatibility with shadcn/ui's component system.

## Configuration Files

### 1. `components.json`
Main configuration file for shadcn/ui CLI:
- **Style**: New York
- **TypeScript**: Disabled (using JSX)
- **CSS Variables**: Enabled
- **Path Aliases**: Configured with `@/` prefix

### 2. `tailwind.config.js`
Tailwind configuration with shadcn/ui color system:
- HSL-based color variables for theming
- Custom border radius utilities
- Font family extensions (Poppins for headings, Inter for body)

### 3. `src/index.css`
Main stylesheet with:
- Tailwind CSS 4 import
- Custom theme tokens (@theme block)
- shadcn/ui CSS variables (light and dark mode)
- Custom animations (float, slideIn, fadeIn)
- Design system tokens (colors, shadows, fonts)

### 4. `vite.config.js`
Vite configuration with:
- Path aliases (`@/` → `./src`)
- Tailwind CSS Vite plugin
- React plugin

## Directory Structure

```
src/
├── components/
│   └── ui/              # shadcn/ui components will be added here
├── lib/
│   ├── utils.js         # cn() utility and helper functions
│   └── animations.js    # Framer Motion animation variants
└── index.css            # Main stylesheet with theme configuration
```

## Adding Components

To add shadcn/ui components, use the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

Components will be automatically added to `src/components/ui/` with proper imports and styling.

## Design System

### Colors
- **Primary**: Sky blue (#38BDF8) - Used for primary actions and accents
- **Surface**: White and off-white backgrounds
- **Text**: Gray scale for typography hierarchy

### Typography
- **Headings**: Poppins (weights: 700, 800)
- **Body**: Inter (weights: 400, 500)
- **Base Size**: 16px with line-height 1.6-1.75

### Spacing
- **Base Grid**: 8px
- **Section Padding**: py-24 to py-32 (96px to 128px)

### Shadows
- **Soft**: Multi-layer subtle shadow
- **Medium**: Standard elevation
- **Large**: High elevation
- **Sky**: Sky blue tinted shadow for primary elements

### Animations
- **Float**: 6s ease-in-out infinite floating effect
- **Slide In**: 0.3s slide from right
- **Fade In**: 0.5s opacity transition

## Theme Customization

The project uses CSS variables for theming. To customize:

1. **Light Mode**: Edit `:root` variables in `src/index.css`
2. **Dark Mode**: Edit `.dark` variables in `src/index.css`
3. **Custom Tokens**: Add to `@theme` block in `src/index.css`

## Utilities

### `cn()` Function
Located in `src/lib/utils.js`, combines clsx and tailwind-merge for conditional class merging:

```javascript
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class', 'override-class')} />
```

### Helper Functions
- `supports3D()`: Check for 3D transform support
- `prefersReducedMotion()`: Check for reduced motion preference
- `getViewportCategory()`: Get current responsive breakpoint
- `debounce()` / `throttle()`: Performance utilities
- `formatCurrency()`: Currency formatting
- `clamp()`: Number clamping

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1279px
- **Desktop**: 1280px - 1535px
- **Wide**: ≥ 1536px

## Best Practices

1. **Use CSS Variables**: Leverage the HSL color system for consistent theming
2. **Component Composition**: Build complex components from shadcn/ui primitives
3. **Accessibility**: All shadcn/ui components are WCAG 2.1 Level AA compliant
4. **Performance**: Use GPU-accelerated properties (transform, opacity) for animations
5. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Integration with Existing Code

The shadcn/ui setup is designed to coexist with existing components:
- Existing components remain unchanged
- New redesigned components use shadcn/ui
- Shared utilities in `lib/` directory
- Consistent design tokens across old and new components

## Next Steps

1. Add required shadcn/ui components using the CLI
2. Create redesigned components in `src/components/redesign/`
3. Implement Magic UI components in `src/components/magic/`
4. Build landing page with new component library

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
