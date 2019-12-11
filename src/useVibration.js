// credit https://github.com/21kb/react-hooks/blob/master/packages/react-vibration-hook/src/index.ts

import { useCallback } from './standard'

export const defaultValue = 200;

const useVibration = (value = defaultValue) => {
  const vibrate = () =>
    useCallback(() => {
      navigator.vibrate(value);
    }, []);

  return vibrate;
};

export default useVibration;
