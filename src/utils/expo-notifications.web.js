// Web fallback for expo-notifications
export const getPermissionsAsync = async () => ({
  status: 'granted',
  granted: true,
});

export const requestPermissionsAsync = async () => ({
  status: 'granted',
  granted: true,
});

export const getExpoPushTokenAsync = async () => ({
  data: 'web-push-token',
  type: 'expo',
});

export const getDevicePushTokenAsync = async () => ({
  data: 'web-device-token',
  type: 'web',
});

export const addNotificationReceivedListener = () => ({
  remove: () => {},
});

export const addNotificationResponseReceivedListener = () => ({
  remove: () => {},
});

export const removeNotificationSubscription = () => {};

export const setNotificationHandler = () => {};

export const scheduleNotificationAsync = async () => {};

export const cancelScheduledNotificationAsync = async () => {};

export const cancelAllScheduledNotificationsAsync = async () => {};

export const getPresentedNotificationsAsync = async () => [];

export const dismissNotificationAsync = async () => {};

export const dismissAllNotificationsAsync = async () => {};

export default {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  getDevicePushTokenAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  setNotificationHandler,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  getPresentedNotificationsAsync,
  dismissNotificationAsync,
  dismissAllNotificationsAsync,
}; 