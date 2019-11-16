import useStorage from './useStorage'

const useProperty = (target, name) => {
  // check if prop is configurable
  const initialDesc = Object.getOwnPropertyDescriptor(target, name)
  const initialValue = initialDesc && ('value' in initialDesc) ? initialDesc.value : target[name]

  let desc = {
    configurable: true,
    get() {
      return initialDesc && initialDesc.get ? initialDesc.get.call(target) : target[name]
    },
    set(value) {
      if (initialDesc && initialDesc.set) initialDesc.set.call(target, value)
      else target[name]
    }
  }

  Object.defineProperty(target, name, desc)

  let storage = {
    get: () => target[name],
    set: value => target[name] = value
  }

  return useStorage(storage, initialValue, { id: 'useProperty' })
}


export default useProperty
