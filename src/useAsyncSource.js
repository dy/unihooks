// useStorage with async backend
// the storage.get and storage.set methods are supposed to be async functions
// exposes `loading` and `error` params to state
import useSource from './useSource'

export default function useAsyncStorage(storage, key, init) {
  let [value, setValue] = useState()
  let state = useSource(storage, key, init)

  // if value is in sync - provide loading flag
  if (state.value.then) {
    state.loading = true
    value.then((result) => {
      state.value = result
      state.loading = false
    }, err => {
      state.error = err
    })
  }

  return state
}
