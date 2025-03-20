# External Actions Checklist

## 1. Google Play Store Setup
- [ ] Create Google Play Developer account ($25 one-time fee)
- [ ] Complete business details and tax information
- [ ] Create app listing
- [ ] Configure ad-free product:
  ```
  Product ID: com.fabletongue.removeads
  Type: One-time purchase
  Price: $4.99 (or your chosen price)
  Title: "Remove Ads"
  Description: "Remove all advertisements permanently"
  ```
- [ ] Set up test accounts for internal testing
- [ ] Configure license testing

## 2. Apple App Store Setup
- [ ] Create Apple Developer account ($99/year)
- [ ] Obtain D-U-N-S Number if needed
- [ ] Complete tax and banking information
- [ ] Create app listing
- [ ] Configure in-app purchase:
  ```
  Product ID: com.fabletongue.removeads
  Type: Non-Consumable
  Price Tier: Tier 4 ($4.99)
  Display Name: "Remove Ads"
  Description: "Remove all advertisements permanently"
  ```
- [ ] Create sandbox tester accounts

## 3. AdMob Setup
- [ ] Create AdMob account
- [ ] Add app to AdMob
- [ ] Create ad units:
  - Banner ad unit
  - Interstitial ad unit
- [ ] Save production ad unit IDs:
  ```
  Android Banner: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYY
  Android Interstitial: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYY
  iOS Banner: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYY
  iOS Interstitial: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYY
  ```
- [ ] Configure ad content settings
- [ ] Set up payment information

## 4. Server Infrastructure
- [ ] Register domain (api.fabletongue.com)
- [ ] Set up SSL certificate
- [ ] Deploy validation server:
  - Choose hosting provider (AWS/GCP/Azure)
  - Set up PostgreSQL database
  - Configure Redis for caching
  - Set up monitoring
- [ ] Configure environment variables:
  ```
  APPLE_SHARED_SECRET=<from App Store Connect>
  GOOGLE_PLAY_PUBLIC_KEY=<from Google Play Console>
  DATABASE_URL=<your database connection string>
  REDIS_URL=<your redis connection string>
  ```

## 5. Analytics Setup
- [ ] Create Firebase project
- [ ] Add iOS and Android apps
- [ ] Download and integrate config files:
  - `google-services.json` for Android
  - `GoogleService-Info.plist` for iOS
- [ ] Configure events to track:
  - Purchase attempts
  - Purchase completions
  - Ad impressions
  - Ad clicks
  - Ad revenue

## 6. Monitoring Setup
- [ ] Set up Sentry account
- [ ] Configure error tracking
- [ ] Set up alerting rules:
  - High validation failure rate
  - Server errors
  - High latency
- [ ] Configure notification channels:
  - Email
  - Slack
  - SMS for critical alerts

## 7. Legal Requirements
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Add GDPR compliance (if serving EU users)
- [ ] Add CCPA compliance (if serving California users)
- [ ] Create support email address
- [ ] Set up support ticket system

## 8. Testing Requirements
- [ ] Test purchase flow on iOS
- [ ] Test purchase flow on Android
- [ ] Test restore purchases on both platforms
- [ ] Test ad display and frequency
- [ ] Test offline behavior
- [ ] Test edge cases:
  - Network interruption during purchase
  - App termination during purchase
  - Multiple devices
  - Account switching

## 9. Support Setup
- [ ] Create customer support email
- [ ] Set up FAQ page
- [ ] Create troubleshooting guide
- [ ] Set up support ticket system
- [ ] Create response templates for common issues

## 10. Financial Setup
- [ ] Set up business bank account
- [ ] Configure tax information for:
  - Google Play
  - App Store
  - AdMob
- [ ] Set up accounting system
- [ ] Configure revenue tracking

## Important Notes
1. Keep all API keys and secrets secure
2. Document all configuration values
3. Set up backup systems
4. Create disaster recovery plan
5. Plan for scaling:
   - Database capacity
   - Server resources
   - Support team

## Regular Maintenance Tasks
- [ ] Monitor server health daily
- [ ] Check validation success rates
- [ ] Review analytics data
- [ ] Update privacy policy as needed
- [ ] Rotate API keys periodically
- [ ] Backup database regularly
- [ ] Review and update alert thresholds 