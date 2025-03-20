declare module 'zustand' {
  import { StateCreator as BaseStateCreator } from 'zustand/vanilla';

  export interface StoreApi<T> {
    getState: () => T;
    setState: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }

  export type StateCreator<T> = (
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void,
    get: () => T,
    api: StoreApi<T>
  ) => T;

  export type Get<T> = () => T;
  export type Set<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;

  export function create<T>(initializer: StateCreator<T>): (selector?: (state: T) => unknown) => T;
} 