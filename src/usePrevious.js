import { useEffect, useRef } from './util/hooks'

export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return [ref.current];
}
