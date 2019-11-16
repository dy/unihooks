import useStorage from './useStorage'
import tuple from 'immutable-tuple'

const cache = new WeakMap

export default function useProperty (target, name, init, deps) {
  let key = tuple(target, name)
  let storage = cache.get(key)

  if (!storage) {
    const initialDesc = Object.getOwnPropertyDescriptor(target, name)

    cache.set(key, storage = {
      get: () => initialDesc && initialDesc.get ? initialDesc.get.call(target) : storage.value,
      set: value => {
        if (initialDesc && initialDesc.set) initialDesc.set.call(target, value)
        else storage.value = value
      },
      value: initialDesc ? (('value' in initialDesc) ? initialDesc.value : null) : target[name]
    })

    const desc = {
      configurable: true,
      get() { return storage.get() },
      set(value) {
        storage.set(value)
        // not `store.set(value)` because no need to write to storage
        store.update(value)
      }
    }

    Object.defineProperty(target, name, desc)
  }

  let [value, store] = useStorage(storage, init, deps)
  return [value, store]
}
