import React, { useState, useEffect } from 'react';
import { Platform, Dimensions, ScaledSize } from 'react-native';
import * as Device from 'expo-device';
import { useWindowDimensions } from 'react-native';

export interface DeviceInfo {
  platform: string;
  isTablet: boolean;
  screenSize: {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  };
  orientation: 'portrait' | 'landscape';
  hasNotch: boolean;
  deviceType: 'phone' | 'tablet' | 'desktop' | 'tv' | 'unknown';
  osVersion: string | number;
  isLowEndDevice: boolean;
}

export class DeviceService {
  private static instance: DeviceService;
  private currentOrientation: 'portrait' | 'landscape';
  private dimensionsSubscription: any;

  private constructor() {
    const { width, height } = Dimensions.get('window');
    this.currentOrientation = width > height ? 'landscape' : 'portrait';
    this.setupDimensionsListener();
  }

  public static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  private setupDimensionsListener() {
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        this.currentOrientation = window.width > window.height ? 'landscape' : 'portrait';
      }
    );
  }

  public cleanup() {
    if (this.dimensionsSubscription) {
      this.dimensionsSubscription.remove();
    }
  }

  public async getDeviceInfo(): Promise<DeviceInfo> {
    const { width, height, scale, fontScale } = Dimensions.get('window');
    const deviceType = await Device.getDeviceTypeAsync();
    
    return {
      platform: Platform.OS,
      isTablet: width >= 600 && height >= 600,
      screenSize: {
        width,
        height,
        scale,
        fontScale,
      },
      orientation: this.currentOrientation,
      hasNotch: this.hasNotch(),
      deviceType: this.getDeviceTypeString(deviceType),
      osVersion: Platform.Version,
      isLowEndDevice: await this.isLowEndDevice(),
    };
  }

  private getDeviceTypeString(deviceType: Device.DeviceType): DeviceInfo['deviceType'] {
    switch (deviceType) {
      case Device.DeviceType.PHONE:
        return 'phone';
      case Device.DeviceType.TABLET:
        return 'tablet';
      case Device.DeviceType.DESKTOP:
        return 'desktop';
      case Device.DeviceType.TV:
        return 'tv';
      default:
        return 'unknown';
    }
  }

  private hasNotch(): boolean {
    const { height } = Dimensions.get('window');
    const isIOS = Platform.OS === 'ios';
    return isIOS && height >= 812;
  }

  private async isLowEndDevice(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    try {
      const totalMemory = await Device.getMaxMemoryAsync() || 0;
      const deviceYear = await Device.deviceYearClass || 0;
      
      return totalMemory < 2000 || deviceYear < 2018;
    } catch (error) {
      console.warn('Error checking device capabilities:', error);
      return false;
    }
  }

  public getResponsiveValue(
    value: number,
    dimension: 'width' | 'height' = 'width'
  ): number {
    const window = Dimensions.get('window');
    const baseWidth = 375; // iPhone X width
    const baseHeight = 812; // iPhone X height
    
    const ratio = dimension === 'width' ? window.width / baseWidth : window.height / baseHeight;
    return value * ratio;
  }

  public getResponsiveFontSize(size: number): number {
    const { fontScale } = Dimensions.get('window');
    return this.getResponsiveValue(size) * fontScale;
  }

  public async getOptimalImageQuality(): Promise<'low' | 'medium' | 'high'> {
    try {
      const isLowEnd = await this.isLowEndDevice();
      if (isLowEnd) {
        return 'low';
      }
      
      const { width, scale } = Dimensions.get('window');
      const pixelWidth = width * scale;
      
      if (pixelWidth <= 750) {
        return 'low';
      } else if (pixelWidth <= 1242) {
        return 'medium';
      } else {
        return 'high';
      }
    } catch (error) {
      console.warn('Error determining optimal image quality:', error);
      return 'medium';
    }
  }

  public getSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const hasNotch = this.hasNotch();
    return {
      top: hasNotch ? 44 : 20,
      right: 0,
      bottom: hasNotch ? 34 : 0,
      left: 0,
    };
  }

  public getOptimalGridColumns(): number {
    const { width } = Dimensions.get('window');
    if (width >= 1024) {
      return 4; // Large tablets and desktops
    } else if (width >= 768) {
      return 3; // Tablets
    } else if (width >= 414) {
      return 2; // Large phones
    } else {
      return 1; // Small phones
    }
  }

  public shouldEnableHighPerformanceMode(): boolean {
    return !this.isLowEndDevice() && Platform.OS !== 'web';
  }
}

// React hook for responsive values
export function useResponsiveValue(value: number, dimension?: 'width' | 'height'): number {
  const window = useWindowDimensions();
  const baseWidth = 375;
  const baseHeight = 812;
  
  const ratio = dimension === 'height'
    ? window.height / baseHeight
    : window.width / baseWidth;
  
  return value * ratio;
}

// React hook for device info
export function useDeviceInfo(): DeviceInfo {
  const deviceService = DeviceService.getInstance();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      const info = await deviceService.getDeviceInfo();
      setDeviceInfo(info);
    };

    loadDeviceInfo();

    const subscription = Dimensions.addEventListener('change', () => {
      loadDeviceInfo();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return deviceInfo || {
    platform: Platform.OS,
    isTablet: false,
    screenSize: {
      width: 0,
      height: 0,
      scale: 1,
      fontScale: 1,
    },
    orientation: 'portrait',
    hasNotch: false,
    deviceType: 'unknown',
    osVersion: Platform.Version,
    isLowEndDevice: false,
  };
} 