// credit of https://github.com/21kb/react-hooks/blob/master/packages/react-device-orientation-hook/src/index.ts
import { useEffect, useState } from './standard'


export const defaultState = {
  angle: 0,
  type: 'landscape-primary',
};

const useOrientation = (initialState = defaultState) => {
  const [state, setState] = useState(initialState);

  const onOrientationChangeEvent = () => {
    const { orientation } = screen;
    const { angle, type } = orientation;

    if (!orientation) {
      setState(initialState);
    }

    setState({ angle, type });
  };

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      onOrientationChangeEvent,
      true,
    );

    return () => {
      window.addEventListener(
        'orientationchange',
        onOrientationChangeEvent,
        true,
      );
    };
  }, []);

  if (!state[0]) state[0] = state
  return state;
};

export default useOrientation;
