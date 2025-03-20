// Web fallback for expo-updates
export const isAvailable = false;
export const isUpdatePending = false;
export const isUpdateAvailable = false;
export const isRollbackAvailable = false;
export const isEmbeddedLaunch = false;

export const checkForUpdateAsync = async () => null;
export const fetchUpdateAsync = async () => null;
export const readLogEntriesAsync = async () => [];
export const clearLogEntriesAsync = async () => {};
export const reloadAsync = async () => {
  window.location.reload();
};
export const reloadFromCache = async () => {
  window.location.reload();
};

export default {
  isAvailable,
  isUpdatePending,
  isUpdateAvailable,
  isRollbackAvailable,
  isEmbeddedLaunch,
  checkForUpdateAsync,
  fetchUpdateAsync,
  readLogEntriesAsync,
  clearLogEntriesAsync,
  reloadAsync,
  reloadFromCache,
}; 