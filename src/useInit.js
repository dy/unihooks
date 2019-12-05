import useSyncEffect from './useSyncEffect'

export default function useInit(fn) {
  useSyncEffect(fn, [])
}
