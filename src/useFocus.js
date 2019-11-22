// credit https://github.com/21kb/react-hooks/blob/master/packages/react-element-focus-hook/src/index.ts

import useState from './useState'
import useEffect from './useEffect'

const useElementFocus = $el => {
  const [state, setState] = useState({});

  const onFocusEvent = (event: FocusEvent) => {
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
