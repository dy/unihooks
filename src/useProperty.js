import useStorage from './useSource'
import tuple from 'immutable-tuple'

const cache = new WeakMap

export default function useProperty (target, name, init) {
  let key = tuple(target, name)
  let storage = cache.get(key)

  if (!storage) {
    const initialDesc = Object.getOwnPropertyDescriptor(target, name)

    cache.set(key, storage = {
      get: (key) => initialDesc && initialDesc.get ? initialDesc.get.call(target) : storage.value,
      set: (key, value) => {
        if (initialDesc && initialDesc.set) initialDesc.set.call(target, value)
        else storage.value = value
      },
      value: initialDesc ? (('value' in initialDesc) ? initialDesc.value : null) : target[name]
    })

    const desc = {
      configurable: true,
      get() {
        return storage.get(key)
      },
      set(value) {
        store.set(value)
      }
    }

    Object.defineProperty(target, name, desc)
  }

  let [value, store] = useStorage(storage, key, init)
  return [value, store]
}
