# FableTongue Development Tasks

## Version Alignment Tasks
1. Expo SDK Version Alignment
   - [x] Update main project to Expo SDK 52.0.40
   - [x] Update all Expo packages to compatible versions:
     - [x] @expo/vector-icons
     - [x] expo-av
     - [x] expo-font
     - [x] expo-notifications
     - [x] expo-speech
     - [x] expo-status-bar
     - [x] expo-store-review
     - [x] expo-updates
   - [x] Resolve peer dependency conflicts
   - [ ] Test app functionality after updates

2. Package Version Management
   - [x] Review and update all package versions in package.json
   - [x] Ensure all packages are compatible with Expo SDK 52
   - [ ] Run dependency audit and fix vulnerabilities
   - [ ] Test app after package updates

## Configuration Tasks
1. App Configuration
   - [x] Create/verify app.json with proper settings:
     - [x] App name and bundle identifier
     - [x] Version numbers
     - [x] Required permissions
     - [x] Platform-specific settings
   - [x] Set up proper asset directories
   - [ ] Configure app icons
   - [ ] Set up splash screens

2. Build Configuration
   - [ ] Configure build settings for iOS
   - [ ] Configure build settings for Android
   - [ ] Set up development and production environments
   - [ ] Configure environment variables

3. Testing Configuration
   - [ ] Set up testing environment
   - [ ] Configure test runners
   - [ ] Set up CI/CD pipeline
   - [ ] Configure automated testing

4. Documentation
   - [ ] Update README with new setup instructions
   - [ ] Document build process
   - [ ] Create deployment guide
   - [ ] Document environment setup

## Next Steps
1. Run the app locally to test functionality
2. Address the 14 vulnerabilities reported by npm audit
3. Create and configure app icons and splash screens
4. Set up build configurations for iOS and Android

## Notes
- Each task should be completed and tested before moving to the next
- Keep track of any issues that arise during updates
- Document any breaking changes
- Test thoroughly after each major change 