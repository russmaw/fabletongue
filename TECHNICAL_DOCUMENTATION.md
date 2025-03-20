# FableTongue Technical Documentation

## Architecture Overview

### 1. Project Structure
```
fabletongue/
├── web/                      # Next.js web application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # Shared components
│   │   └── styles/         # Global styles
└── [mobile]/                # Expo mobile application (to be integrated)
```

### 2. Technology Stack

#### Web Platform (Next.js)
- **Framework**: Next.js 14.1.0
- **UI Layer**: React 18.2.0 with React Native Web 0.19.10
- **Styling**: Combination of React Native StyleSheet and Platform-specific styles
- **Navigation**: React Navigation (web-compatible version)
- **State Management**: To be implemented (recommended: React Context or Redux)
- **Build & Deploy**: Netlify with Next.js plugin

#### Cross-Platform Components
- Shared components using React Native Web
- Platform-specific styling using Platform.select()
- Responsive design considerations for web/mobile

## Features & Implementation

### 1. UI Components

#### Button Component (`src/components/shared/Button.tsx`)
```typescript
interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```
- Platform-specific styling (cursor on web)
- Variant support (primary/secondary)
- Accessibility considerations needed:
  - [ ] Add aria-labels
  - [ ] Keyboard navigation support
  - [ ] Focus states

#### Card Component (`src/components/shared/Card.tsx`)
```typescript
interface CardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}
```
- Platform-specific shadows
- Optional touch interaction
- Composition support via children
- Needed improvements:
  - [ ] Loading state
  - [ ] Error boundary
  - [ ] Image support

### 2. Styling System

#### Global Styles (`src/styles/global.ts`)
- Color system
- Spacing scale
- Typography (to be implemented)
- Responsive design utilities needed:
  - [ ] Breakpoint system
  - [ ] Media query helpers
  - [ ] Layout components

### 3. Technical Considerations

#### Cross-Platform Compatibility
1. **Web-Specific Features**:
   - Next.js routing
   - SEO optimization needed
   - Web-specific gesture handling

2. **Mobile Considerations**:
   - Touch feedback
   - Native scrolling
   - Platform-specific UI adjustments

#### Performance Optimizations
1. **Current Implementation**:
   - SWC compilation
   - Static optimization via Next.js
   - Component-level code splitting

2. **Needed Improvements**:
   - [ ] Image optimization
   - [ ] Lazy loading
   - [ ] Performance monitoring
   - [ ] Bundle size analysis

#### Security Considerations
1. **Current Measures**:
   - Strict TypeScript configuration
   - CSP headers needed
   - Environment variable handling

2. **To Be Implemented**:
   - [ ] Authentication system
   - [ ] API route protection
   - [ ] Input sanitization
   - [ ] CSRF protection

## Development Workflow

### 1. Setup Instructions
```bash
# Install dependencies
cd web
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Deployment Process
1. **Netlify Configuration**:
   ```toml
   [build]
     base = "web"
     command = "npm run build"
     publish = ".next"
   ```
   - Node.js 18 environment
   - Next.js plugin enabled
   - Custom domain setup needed

### 3. Testing Strategy (To Be Implemented)
- [ ] Unit tests (Jest)
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Cypress)
- [ ] Mobile testing strategy

## Known Issues & Limitations

1. **Platform-Specific Issues**:
   - Height calculations on web
   - Touch feedback on different platforms
   - Font loading and consistency

2. **Browser Compatibility**:
   - IE11 not supported
   - Safari flexbox gap support
   - Mobile browser quirks

3. **Build Process**:
   - Large bundle size potential
   - Development environment setup complexity
   - Mobile build process to be integrated

## Future Improvements

1. **Immediate Priorities**:
   - Authentication system
   - API integration
   - State management
   - Testing infrastructure

2. **Technical Debt**:
   - Component documentation
   - Accessibility improvements
   - Performance optimization
   - Error boundary implementation

3. **Feature Roadmap**:
   - Offline support
   - Push notifications
   - Language selection
   - Progress tracking

## Maintenance Guidelines

1. **Code Standards**:
   - TypeScript strict mode
   - ESLint configuration
   - Component patterns
   - Style guide enforcement

2. **Performance Monitoring**:
   - Lighthouse scores
   - Bundle size tracking
   - Error tracking
   - Analytics implementation

3. **Security Updates**:
   - Dependency updates
   - Security audit process
   - Vulnerability scanning

## Support & Resources

1. **Documentation**:
   - Component storybook (to be implemented)
   - API documentation
   - Style guide

2. **Troubleshooting**:
   - Common issues
   - Debug process
   - Support channels

3. **Team Resources**:
   - Repository access
   - Development environment setup
   - Contribution guidelines 