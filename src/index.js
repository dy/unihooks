export { default } from 'any-hooks'

export * from './standard'

// component
export { default as useStore, createStore } from './useStore'
export { default as useAction, createAction } from './useAction'

// data
export { default as useLocalStorage } from './useLocalStorage'
export { default as useProperty } from './useProperty'
export { default as useStorage } from './useStorage'
export { default as useQueryParam } from './useQueryParam'
export { default as useGlobalCache } from './useGlobalCache'
export { default as useCookie } from './useCookie'
export { default as useFormField } from './useFormField'

// state
export { default as usePrevious } from './usePrevious'
export { default as useCountdown } from './useCountdown'
export { default as useThrottle } from './useThrottle'

// effect
export { default as useInit } from './useInit'
export { default as useSyncEffect } from './useSyncEffect'
export { default as useTimeout } from './useTimeout'
export { default as useInterval } from './useInterval'

// DOM
export { default as useAttribute } from './useAttribute'
export { default as useClickInside } from './useClickInside'
export { default as useClickOutside } from './useClickOutside'

// hardware
export { default as useOnLine } from './useOnLine'
