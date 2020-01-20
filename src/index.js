import setHooks from 'any-hooks'

export default (hooks) => {
  setHooks(hooks)
}

export * from './standard'

export { default as useStore, createStore, setStore, getStore } from './useStore'
export { default as useAction, createAction } from './useAction'

export { default as useLocalStorage } from './useLocalStorage'
export { default as useProperty } from './useProperty'
export { default as useSource } from './useSource'
export { default as useQueryParam } from './useQueryParam'
export { default as useGlobalCache } from './useGlobalCache'
export { default as useCookie } from './useCookie'
export { default as useFormField } from './useFormField'

export { default as usePrevious } from './usePrevious'
export { default as useCountdown } from './useCountdown'
export { default as useThrottle } from './useThrottle'
export { default as useChannel } from './useChannel'
export { default as useValidate } from './useValidate'
export { default as useDiffState } from './useDiffState'

export { default as useSyncEffect } from './useSyncEffect'
export { default as useTimeout } from './useTimeout'
export { default as useInterval } from './useInterval'

export { default as useAttribute } from './useAttribute'
export { default as useClickInside } from './useClickInside'
export { default as useClickOutside } from './useClickOutside'

export { default as useInput } from './useInput'
export { default as useElement } from './useElement'


export { default as useOnLine } from './useOnLine'
