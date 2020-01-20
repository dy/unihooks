import { useMemo, useState, useEffect } from './standard'

export default function useValidate(validate) {
  let runValidate = useMemo(() => {
    if (Array.isArray(validate)) {
      return (value) => {
        try {
          let result
          validate.find(validate => {
            result = validate(value)
            if (result !== true && result !== undefined) return true
          })
          if (result === true || result === undefined) {
            if (error !== null) setError(null)
            return true
          }
          throw result
        } catch (e) {
          if (!error || e.message !== error.message) setError(e)
          return false
        }
      }
    }

    return (value) => {
      try {
        let result = validate(value)
        if (result === true || result === undefined) {
          if (error !== null) setError(null)
          return true
        }
        throw result
      } catch (e) {
        if (!error || e.message !== error.message) setError(e)
        return false
      }
    }
  }, Array.isArray(validate) ? validate : [validate])

  let [error, setError] = useState(null)

  return [error, runValidate]
}
