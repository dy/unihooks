import useRef from './useRef.js'
import useEffect from './useEffect.js'

export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return [ref.current];
}
