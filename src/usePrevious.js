import { useEffect, useRef } from './standard'

export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return [ref.current];
}
