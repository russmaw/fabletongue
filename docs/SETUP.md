# FableTongue Detailed Setup Guide

## Table of Contents
1. [Store Configuration](#store-configuration)
2. [Server Setup](#server-setup)
3. [Error Handling](#error-handling)
4. [Monitoring & Alerting](#monitoring--alerting)
5. [Analytics Integration](#analytics-integration)

## Store Configuration

### Google Play Store Setup

1. **Developer Account Setup**
```bash
# Visit Google Play Console
URL: https://play.google.com/console

# Required Information
- Business name
- Contact details
- Tax information
- Payment method for $25 fee
```

2. **In-App Product Configuration**
```json
{
  "productId": "com.fabletongue.removeads",
  "type": "non-consumable",
  "pricing": {
    "basePrice": {
      "currency": "USD",
      "amount": 4.99
    },
    "regionalPricing": "automatic"
  },
  "listing": {
    "title": "Remove Ads",
    "description": "Remove all advertisements permanently"
  }
}
```

3. **Test Account Setup**
```bash
# Internal Testing
- Add test emails in Play Console
- Enable license testing
- Add test payment methods

# Testing Commands
# Verify license
./gradlew verifyLicenseTest

# Test purchase flow
./gradlew runInAppBillingTest
```

### Apple App Store Setup

1. **Developer Account Setup**
```bash
# Visit Apple Developer Portal
URL: https://developer.apple.com

# Required Information
- D-U-N-S Number
- Tax information
- Team setup
- Payment for $99/year
```

2. **In-App Purchase Setup**
```json
{
  "productId": "com.fabletongue.removeads",
  "type": "NON_CONSUMABLE",
  "pricing": {
    "tier": "Tier 4",
    "price": 4.99
  },
  "languages": ["en-US"],
  "review_notes": "This purchase removes all advertisements from the app permanently."
}
```

3. **Sandbox Testing**
```bash
# Create Sandbox Testers
1. App Store Connect > Users and Access > Sandbox
2. Add testers with unique emails
3. Configure test scenarios:
   - Successful purchase
   - Failed purchase
   - Interrupted purchase
```

## Server Setup

### Backend Infrastructure

1. **Server Requirements**
```bash
# System Requirements
Node.js >= 16.0.0
PostgreSQL >= 13.0
Redis >= 6.0

# SSL Certificate
- Domain: api.fabletongue.com
- Provider: Let's Encrypt
- Auto-renewal setup
```

2. **Database Schema**
```sql
-- Purchases Table
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    receipt_data TEXT NOT NULL,
    platform VARCHAR(10) NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    validation_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL
);

-- Validation Attempts Table
CREATE TABLE validation_attempts (
    id SERIAL PRIMARY KEY,
    receipt_data TEXT NOT NULL,
    platform VARCHAR(10) NOT NULL,
    attempt_date TIMESTAMP NOT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    ip_address VARCHAR(45)
);

-- Create indexes
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_transaction_id ON purchases(transaction_id);
CREATE INDEX idx_validation_attempts_date ON validation_attempts(attempt_date);
```

3. **Receipt Validation Service**
```typescript
// src/services/receiptValidation.ts
import { AppStoreValidator, GooglePlayValidator } from './validators';

export class ReceiptValidationService {
  private appStoreValidator: AppStoreValidator;
  private googlePlayValidator: GooglePlayValidator;

  constructor() {
    this.appStoreValidator = new AppStoreValidator(
      process.env.APPLE_SHARED_SECRET
    );
    this.googlePlayValidator = new GooglePlayValidator(
      process.env.GOOGLE_PLAY_PUBLIC_KEY
    );
  }

  async validateReceipt(data: {
    receipt: string;
    platform: 'ios' | 'android';
    userId: string;
  }): Promise<ValidationResult> {
    try {
      // Rate limiting check
      await this.checkRateLimit(data.userId);

      // Platform-specific validation
      const validationResult = data.platform === 'ios'
        ? await this.appStoreValidator.validate(data.receipt)
        : await this.googlePlayValidator.validate(data.receipt);

      // Record validation attempt
      await this.recordValidationAttempt({
        ...data,
        success: validationResult.isValid,
      });

      // Store valid purchase
      if (validationResult.isValid) {
        await this.storePurchase({
          ...data,
          ...validationResult,
        });
      }

      return validationResult;
    } catch (error) {
      await this.recordValidationAttempt({
        ...data,
        success: false,
        error: error.message,
      });
      throw error;
    }
  }

  private async checkRateLimit(userId: string): Promise<void> {
    const attempts = await this.getRecentAttempts(userId);
    if (attempts > 10) {
      throw new Error('Rate limit exceeded');
    }
  }

  private async recordValidationAttempt(data: ValidationAttemptData): Promise<void> {
    // Implementation
  }

  private async storePurchase(data: PurchaseData): Promise<void> {
    // Implementation
  }
}
```

4. **API Endpoints**
```typescript
// src/routes/validation.ts
import { Router } from 'express';
import { ReceiptValidationService } from '../services/receiptValidation';
import { validateRequest, authenticate } from '../middleware';

const router = Router();
const validationService = new ReceiptValidationService();

router.post(
  '/validate-receipt',
  authenticate,
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await validationService.validateReceipt({
        receipt: req.body.receipt,
        platform: req.body.platform,
        userId: req.user.id,
      });

      res.json({
        isValid: result.isValid,
        transactionId: result.transactionId,
        purchaseDate: result.purchaseDate,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/restore-purchases',
  authenticate,
  async (req, res, next) => {
    try {
      const purchases = await validationService.getUserPurchases(req.user.id);
      res.json({ purchases });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

## Error Handling

### Client-Side Error Handling

1. **Purchase Error Handler**
```typescript
// src/utils/purchaseErrorHandler.ts
export class PurchaseErrorHandler {
  static async handleError(error: any): Promise<string> {
    // Log error to analytics
    await Analytics.logEvent('purchase_error', {
      code: error.code,
      message: error.message,
    });

    // Map error codes to user-friendly messages
    const errorMessages = {
      E_ALREADY_OWNED: 'You already own this item. Try restoring purchases.',
      E_SERVICE_ERROR: 'Service temporarily unavailable. Please try again.',
      E_USER_CANCELLED: 'Purchase cancelled.',
      E_ITEM_UNAVAILABLE: 'This item is no longer available.',
      E_NETWORK_ERROR: 'Please check your internet connection.',
      E_RECEIPT_FAILED: 'Purchase validation failed. Please contact support.',
      DEFAULT: 'An unexpected error occurred. Please try again.',
    };

    return errorMessages[error.code] || errorMessages.DEFAULT;
  }

  static async handleValidationError(error: any): Promise<void> {
    // Log validation error
    await Analytics.logEvent('validation_error', {
      code: error.code,
      message: error.message,
    });

    // Attempt recovery
    if (error.code === 'RECEIPT_EXPIRED') {
      await this.refreshReceipt();
    }

    // Notify monitoring service
    await Monitoring.notifyError('receipt_validation_failed', error);
  }
}
```

2. **Network Error Handler**
```typescript
// src/utils/networkErrorHandler.ts
export class NetworkErrorHandler {
  private static maxRetries = 3;
  private static retryDelay = 1000; // ms

  static async handleNetworkError(
    operation: () => Promise<any>,
    context: string
  ): Promise<any> {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (!this.isRetryable(error)) {
          throw error;
        }

        await this.wait(this.retryDelay * attempt);
        
        // Log retry attempt
        await Analytics.logEvent('network_retry', {
          context,
          attempt,
          error: error.message,
        });
      }
    }

    throw lastError;
  }

  private static isRetryable(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      error.code === 'SERVER_ERROR'
    );
  }

  private static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Monitoring & Alerting

### Setup Monitoring

1. **Server Monitoring**
```typescript
// src/monitoring/server.ts
import * as Sentry from '@sentry/node';
import { Metrics } from './metrics';

export class ServerMonitoring {
  static initialize() {
    // Initialize Sentry
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });

    // Initialize metrics
    Metrics.initialize({
      host: process.env.METRICS_HOST,
      port: process.env.METRICS_PORT,
    });
  }

  static trackEndpoint(path: string, method: string) {
    return async (req: any, res: any, next: any) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        
        Metrics.recordHttpRequest({
          path,
          method,
          statusCode: res.statusCode,
          duration,
        });
      });

      next();
    };
  }

  static trackValidation(result: ValidationResult) {
    Metrics.recordValidation({
      success: result.isValid,
      platform: result.platform,
      duration: result.duration,
    });
  }
}
```

2. **Alert Configuration**
```yaml
# alerting/rules.yaml
groups:
  - name: purchase_validation
    rules:
      - alert: HighValidationFailureRate
        expr: rate(validation_failures_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High validation failure rate
          description: More than 10% of validations are failing

      - alert: ServerError
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: Server returning 5xx errors
          description: Server errors detected in the last 2 minutes

      - alert: HighLatency
        expr: http_request_duration_seconds{quantile="0.9"} > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: 90th percentile latency is above 2 seconds
```

## Analytics Integration

### Purchase Analytics

1. **Event Tracking**
```typescript
// src/analytics/purchase.ts
export class PurchaseAnalytics {
  static async trackPurchaseFlow(data: {
    userId: string;
    productId: string;
    platform: string;
    step: string;
  }) {
    await Analytics.logEvent('purchase_flow', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackPurchaseComplete(data: {
    userId: string;
    productId: string;
    platform: string;
    amount: number;
    currency: string;
  }) {
    await Analytics.logEvent('purchase_complete', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Track revenue
    await Analytics.logRevenue({
      productId: data.productId,
      amount: data.amount,
      currency: data.currency,
    });
  }

  static async trackRestorePurchases(data: {
    userId: string;
    platform: string;
    success: boolean;
    purchaseCount?: number;
  }) {
    await Analytics.logEvent('restore_purchases', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
```

2. **Ad Analytics**
```typescript
// src/analytics/ads.ts
export class AdAnalytics {
  static async trackAdImpression(data: {
    adUnit: string;
    type: 'banner' | 'interstitial';
    placement: string;
  }) {
    await Analytics.logEvent('ad_impression', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackAdClick(data: {
    adUnit: string;
    type: 'banner' | 'interstitial';
    placement: string;
  }) {
    await Analytics.logEvent('ad_click', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackAdRevenue(data: {
    adUnit: string;
    revenue: number;
    currency: string;
  }) {
    await Analytics.logEvent('ad_revenue', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Deployment Checklist

### Pre-Deployment
```bash
# 1. Environment Variables
cp .env.example .env
# Fill in all required environment variables

# 2. Database Setup
npm run db:migrate
npm run db:seed

# 3. SSL Certificate
certbot certonly --nginx -d api.fabletongue.com

# 4. Test All Endpoints
npm run test:integration

# 5. Load Testing
npm run test:load
```

### Post-Deployment
```bash
# 1. Verify Monitoring
curl https://api.fabletongue.com/health

# 2. Test Purchase Flow
npm run test:purchase-flow

# 3. Verify Analytics
npm run verify:analytics

# 4. Check Alerts
npm run verify:alerts
```

## Support Documentation

### Common Issues and Solutions
1. Purchase Validation Failures
   - Check internet connection
   - Verify receipt format
   - Confirm product ID matches
   - Check server logs for detailed error

2. Restore Purchase Issues
   - Verify user is signed in
   - Check purchase history
   - Validate receipt again
   - Clear app data and retry

3. Ad-Related Issues
   - Check ad unit IDs
   - Verify ad network status
   - Check ad frequency settings
   - Monitor ad performance metrics 