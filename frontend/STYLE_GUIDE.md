# UX/UI Style Guide

## Overview
This document defines the comprehensive design system and UX guidelines for Release Please.

## Design Tokens

### Color System

#### Primary Colors
- Primary 500: `#3b82f6` - Main brand color
- Primary 600: `#2563eb` - Hover states
- Primary 700: `#1d4ed8` - Active states

#### Secondary Colors
- Secondary 500: `#64748b` - Supporting elements
- Secondary 600: `#475569` - Hover states

#### Semantic Colors
- Success: `#22c55e` - Positive actions, confirmations
- Warning: `#f59e0b` - Caution, warnings
- Error: `#ef4444` - Errors, destructive actions
- Info: `#3b82f6` - Informational messages

#### Neutral Colors
- Background: `hsl(0 0% 100%)` / `hsl(222.2 84% 4.9%)` (light/dark)
- Foreground: Text colors
- Border: Dividers and borders
- Muted: Secondary text

### Typography

#### Font Families
- **Sans-serif**: System font stack for optimal performance
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace**: For code and technical content
  `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace`

#### Font Scale
- xs: 12px / 0.75rem
- sm: 14px / 0.875rem
- base: 16px / 1rem
- lg: 18px / 1.125rem
- xl: 20px / 1.25rem
- 2xl: 24px / 1.5rem
- 3xl: 30px / 1.875rem
- 4xl: 36px / 2.25rem
- 5xl: 48px / 3rem

#### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing System

Based on 4px unit scale:
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px
- 24: 96px

### Border Radius
- none: 0
- sm: 2px
- md: 6px
- lg: 8px
- xl: 12px
- 2xl: 16px
- full: 9999px

### Shadows
- sm: Subtle elevation
- md: Standard cards
- lg: Modals, popovers
- xl: Dialogs
- 2xl: Maximum elevation

### Animation

#### Durations
- Fast: 150ms - Micro-interactions
- Normal: 250ms - Standard transitions
- Slow: 350ms - Large movements
- Slower: 500ms - Page transitions

#### Easing Functions
- ease-in-out: `cubic-bezier(0.4, 0, 0.2, 1)` - Default
- ease-out: `cubic-bezier(0, 0, 0.2, 1)` - Entering
- ease-in: `cubic-bezier(0.4, 0, 1, 1)` - Exiting

## Component Guidelines

### Buttons

#### Variants
- **Primary**: Main actions (Create, Save, Submit)
- **Secondary**: Secondary actions (Cancel, Back)
- **Tertiary**: Less prominent actions
- **Destructive**: Dangerous actions (Delete, Remove)
- **Ghost**: Minimal styling, icon buttons
- **Link**: Text-style buttons

#### Sizes
- sm: Height 32px, compact spaces
- md: Height 40px, standard
- lg: Height 48px, emphasis

#### States
- Default
- Hover: Slightly darker, scale 1.02
- Active: Pressed, scale 0.98
- Disabled: Opacity 50%, no interaction
- Loading: Show spinner, disabled

### Cards

#### Usage
- Container for related content
- Support hover effects for interactivity
- Multiple padding options: none, sm, md, lg

#### Composition
- CardHeader: Title and description
- CardContent: Main content
- CardFooter: Actions

### Inputs

#### Types
- Text
- Email
- Password
- Number
- Textarea

#### Features
- Labels (optional)
- Helper text
- Error messages
- Left/right icons
- Validation states

### Modals

#### Sizes
- sm: 448px - Simple confirmations
- md: 512px - Standard forms
- lg: 672px - Complex content
- xl: 896px - Rich content
- full: 95vw - Maximum space

#### Features
- Backdrop blur
- Close on escape
- Close on backdrop click (optional)
- Focus trap
- Smooth animations

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Skip navigation links

### Screen Readers
- Semantic HTML
- ARIA labels and descriptions
- ARIA live regions for dynamic content
- Role attributes

### Color Contrast
- Minimum contrast ratio 4.5:1 for normal text
- Minimum contrast ratio 3:1 for large text
- Ensure information is not conveyed by color alone

### Motion
- Respect `prefers-reduced-motion`
- Disable animations when preferred
- Provide alternatives to motion-based interactions

## Responsive Design

### Breakpoints
- xs: < 475px - Small phones
- sm: ≥ 640px - Large phones
- md: ≥ 768px - Tablets
- lg: ≥ 1024px - Laptops
- xl: ≥ 1280px - Desktops
- 2xl: ≥ 1536px - Large screens

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly targets (minimum 44x44px)
- Optimize for thumbs (bottom navigation)

## Best Practices

### Performance
- Lazy load components
- Code splitting
- Optimize images
- Minimize bundle size
- Use CSS transforms for animations

### User Experience
- Provide immediate feedback
- Use loading states
- Show progress indicators
- Handle errors gracefully
- Maintain consistent patterns

### Consistency
- Use design system components
- Follow naming conventions
- Maintain visual hierarchy
- Use consistent spacing
- Keep interactions predictable

## Component Examples

### Button Usage
```tsx
// Primary action
<Button variant="primary">Create Release</Button>

// With icon
<Button variant="primary" leftIcon={<Plus />}>
  Add Item
</Button>

// Loading state
<Button variant="primary" isLoading>
  Saving...
</Button>
```

### Card Usage
```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Release v2.0.0</CardTitle>
    <CardDescription>Published 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>
    Release notes content...
  </CardContent>
</Card>
```

### Modal Usage
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to continue?</p>
  <ModalFooter>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
