import useElement from './useElement'

const cache = new Map

export default function useForm(target) {
  const [el] = useElement(target)

  useSyncEffect(() => {
    if (!cache.has(target)) cache.set(target, {
      get(key) {
        return el && el.value
      },
      set(key, value) {
        if (!el) return
        el.value = value
        el.setAttribute('value', value)
      }
    });
    return () => {
      cache.delete(target)
    }
  }, [el])

  let store = useStorage(cache.get(target), 'value', init)

  return store
}
