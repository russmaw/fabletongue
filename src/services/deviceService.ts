import React, { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import * as Device from 'expo-device';

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
  screenDensity: 'low' | 'medium' | 'high';
  isLandscape: boolean;
}

class DeviceService {
  private currentOrientation: 'portrait' | 'landscape' = 'portrait';

  public async getDeviceInfo(): Promise<DeviceInfo> {
    const { width, height, scale, fontScale } = Dimensions.get('window');
    const deviceType = await Device.getDeviceTypeAsync();
    
    // Enhanced tablet detection
    const isTablet = await this.isTabletDevice();
    
    return {
      platform: Platform.OS,
      isTablet,
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
      screenDensity: this.getScreenDensity(),
      isLandscape: width > height,
    };
  }

  private async isTabletDevice(): Promise<boolean> {
    if (Platform.OS === 'web') {
      const { width } = Dimensions.get('window');
      return width >= 768;
    }

    try {
      // Use multiple methods to detect tablets
      const deviceType = await Device.getDeviceTypeAsync();
      const { width, height } = Dimensions.get('window');
      const pixelRatio = PixelRatio.get();
      
      // Check if device is explicitly a tablet
      if (deviceType === Device.DeviceType.TABLET) {
        return true;
      }
      
      // Check screen dimensions and pixel ratio
      const isLargeScreen = width >= 600 && height >= 600;
      const hasTabletPixelRatio = pixelRatio >= 2;
      
      return isLargeScreen && hasTabletPixelRatio;
    } catch (error) {
      console.warn('Error detecting tablet:', error);
      return false;
    }
  }

  private getScreenDensity(): 'low' | 'medium' | 'high' {
    const pixelRatio = PixelRatio.get();
    if (pixelRatio <= 1) return 'low';
    if (pixelRatio <= 2) return 'medium';
    return 'high';
  }

  public getOptimalGridColumns(): number {
    const { width } = Dimensions.get('window');
    const isTablet = width >= 768;
    
    if (width >= 1024) {
      return isTablet ? 4 : 3; // Large tablets and desktops
    } else if (width >= 768) {
      return isTablet ? 3 : 2; // Tablets
    } else if (width >= 414) {
      return 2; // Large phones
    } else {
      return 1; // Small phones
    }
  }

  public getOptimalSpacing(): number {
    const { width } = Dimensions.get('window');
    const isTablet = width >= 768;
    
    if (isTablet) {
      return width >= 1024 ? 24 : 20;
    } else {
      return width >= 414 ? 16 : 12;
    }
  }

  public getOptimalFontSize(baseSize: number): number {
    const { width, fontScale } = Dimensions.get('window');
    const isTablet = width >= 768;
    
    const sizeMultiplier = isTablet ? 1.2 : 1;
    return baseSize * sizeMultiplier * fontScale;
  }

  public shouldEnableHighPerformanceMode(): boolean {
    const isLowEnd = this.isLowEndDevice();
    const isTablet = this.isTabletDevice();
    
    // Enable high performance mode for tablets unless they're low-end
    return (!isLowEnd && isTablet) || Platform.OS === 'web';
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
}

export default new DeviceService(); 