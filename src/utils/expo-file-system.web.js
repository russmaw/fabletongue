// Web fallback for expo-file-system
export const documentDirectory = null;
export const cacheDirectory = null;
export const getInfoAsync = async () => ({ exists: false });
export const readAsStringAsync = async () => '';
export const writeAsStringAsync = async () => {};
export const deleteAsync = async () => {};
export const moveAsync = async () => {};
export const copyAsync = async () => {};
export const makeDirectoryAsync = async () => {};
export const readDirectoryAsync = async () => [];
export const getContentUriAsync = async () => null;

export default {
  documentDirectory,
  cacheDirectory,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  moveAsync,
  copyAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
  getContentUriAsync,
}; 