import { storage, PREFIX } from './useStore'

export default createStore = (key, init) => {
  key = PREFIX + key
  storage.set(key, init)
}
