// Web fallback for expo-device
export const DeviceType = {
  PHONE: 'phone',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  TV: 'tv',
};

export const getDeviceTypeAsync = async () => {
  const { width, height } = window.innerWidth;
  return width >= 768 ? DeviceType.TABLET : DeviceType.PHONE;
};

export const getMaxMemoryAsync = async () => {
  // Web browsers don't expose memory information
  return null;
};

export const deviceYearClass = null;

export const getDeviceNameAsync = async () => {
  return 'Web Browser';
};

export const getDeviceBrandAsync = async () => {
  return 'Web';
};

export const getDeviceModelAsync = async () => {
  return 'Browser';
};

export const getDeviceName = () => {
  return 'Web Browser';
};

export const getDeviceBrand = () => {
  return 'Web';
};

export const getDeviceModel = () => {
  return 'Browser';
};

export const getDeviceType = () => {
  const { width } = window.innerWidth;
  return width >= 768 ? DeviceType.TABLET : DeviceType.PHONE;
};

export default {
  DeviceType,
  getDeviceTypeAsync,
  getMaxMemoryAsync,
  deviceYearClass,
  getDeviceNameAsync,
  getDeviceBrandAsync,
  getDeviceModelAsync,
  getDeviceName,
  getDeviceBrand,
  getDeviceModel,
  getDeviceType,
}; 