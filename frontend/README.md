# Release Please Frontend

A modern, comprehensive web interface for Release Please with exceptional UX features.

## 🎨 Features

### Core UX Features
- ✅ **Modern Design System** - Comprehensive design tokens and component library
- ✅ **Dark/Light Mode** - Seamless theme switching with system preference detection
- ✅ **Real-Time Updates** - Socket.IO integration for live notifications
- ✅ **Responsive Design** - Mobile-first approach with touch-friendly interactions
- ✅ **Accessibility** - WCAG 2.1 AA compliant with keyboard navigation
- ✅ **Command Palette** - Quick access to all actions (⌘K / Ctrl+K)
- ✅ **Notification System** - Multi-channel notifications with toast messages
- ✅ **Smooth Animations** - Framer Motion powered micro-interactions
- ✅ **Loading States** - Spinners, skeletons, and progress indicators

### Component Library
- Button (primary, secondary, tertiary, destructive, ghost, link)
- Card (with header, content, footer)
- Input & Textarea (with labels, errors, icons)
- Modal (with backdrop, animations)
- Badge (multiple variants, status indicators)
- Avatar (with fallback, status)
- Loading (spinner, skeleton, progress bar)
- Command Palette
- Notification Center

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.IO Client
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── CommandPalette.tsx
│   │   ├── layout/          # Layout components
│   │   │   └── Header.tsx
│   │   └── features/        # Feature-specific components
│   │       └── NotificationCenter.tsx
│   ├── pages/               # Page components
│   │   └── Dashboard.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useResponsive.ts
│   │   └── useCommon.ts
│   ├── contexts/            # Context providers
│   │   ├── ThemeContext.tsx
│   │   ├── SocketContext.tsx
│   │   └── NotificationContext.tsx
│   ├── styles/              # Global styles and themes
│   │   ├── globals.css
│   │   └── tokens.ts
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Color Palette
The design system uses HSL color tokens for easy theme switching:
- Primary: Brand colors
- Secondary: Supporting colors
- Semantic: Success, Warning, Error, Info
- Neutral: Grayscale for text and backgrounds

### Typography
- Font Family: System font stack for optimal performance
- Font Sizes: xs (12px) to 5xl (48px)
- Font Weights: Light (300) to Bold (700)
- Line Heights: Tight (1.25), Normal (1.5), Relaxed (1.75)

### Spacing
Consistent spacing scale from 0 to 24 (0px to 96px)

### Animations
- Duration: Fast (150ms), Normal (250ms), Slow (350ms)
- Easing: Ease-in, Ease-out, Ease-in-out
- Respects `prefers-reduced-motion`

## ⌨️ Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Open command palette
- `/` - Focus search
- `?` - Show keyboard shortcuts
- `Esc` - Close modal/dialog
- `⌘D` / `Ctrl+D` - Toggle dark mode

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation support
- Screen reader optimized (ARIA labels)
- Focus indicators
- Color contrast compliance
- Reduced motion support

## 📱 Responsive Breakpoints

- xs: 475px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## 🧪 Testing

```bash
npm run test
```

## 📦 Building for Production

```bash
npm run build
```

The build outputs to the `dist` directory and is optimized for production.

## 🤝 Contributing

Please read the main project's CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
