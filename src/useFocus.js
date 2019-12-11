// credit https://github.com/21kb/react-hooks/blob/master/packages/react-element-focus-hook/src/index.ts
import { useEffect, useState } from './standard'

const useElementFocus = $el => {
  const [state, setState] = useState({});

  const onFocusEvent = (event) => {
    setState({
      type: event.type,
    });
  };

  useEffect(() => {
    $el.addEventListener('onfocus', onFocusEvent);

    return () => {
      $el.removeEventListener('onfocus', onFocusEvent);
    };
  });

  return state;
};

export default useElementFocus;
