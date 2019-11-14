# unihooks ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/dy/unihooks.svg?branch=master)](https://travis-ci.org/dy/unihooks)

Unified essential multiframework hooks.

[![NPM](https://nodei.co/npm/unihooks.png?mini=true)](https://nodei.co/npm/unihooks/)

```js
import { useLocation, useQueryParam, useLocalStorage } from 'unihooks'

function MyComponent () {
  // browser location
  let [ location, setLocation ] = useLocation()

  // query string param
  let [ id, setId ] = useQueryString('id', 0)

  // local storage value
  let [ cart, setCart ] = useLocalStorage('cart', [])
}
```

## Principles

#### 3. Cross-framework

_Unihooks_ work in any hooks-enabled framework: [react](https://ghub.io/react), [preact](https://ghub.io/preact), [haunted](https://ghub.io/haunted), [atomico](https://ghub.io/atomico), [augmented](https://ghub.io/augmented) – via [any-hooks](https://ghub.io/any-hooks).

<!--
If target framework is known in advance, the corresponding entry can be used:

```js
// framework is detected automatically
import * as hook from 'unihooks'

// preact hooks
import * as hook from 'unihooks/preact'
```
-->

#### 2. Unified

_Unihooks_ follow generalized API signature, derived from `useState` / `useEffect`:

```
let [ state, action ] = useDomain( key?, initialState? )
let [ result, status ] = useCall( fn, deps? )
```

#### 1. Reactive

Hooks observe some changing data source and trigger update. Static hooks are not allowed.

```js
// no
function MyComponent () {
  let ua = useUserAgent()
}

// yes
function MyComponent () {
  let ua = useMemo(() => navigator.userAgent)
}
```


## API

<!--

### `let [state, setState] = useState(target|key?, init, deps?)`

`useState` extension with `target` or `key` first argument and `deps` the last argument. State can be identified, read and reinitialized that way.

```js
let [x, setX] = useState(element, null, [])

// depending on component props - reinit the state
let [value, setValue] = useState(() => props.x, [props.x])
```

Ref: [use-store](https://ghub.io/use-store)

-->

### `useLocalStorage(key, init)`

`useState` with persistency to local storage by `key`.

```js
const [state, setState] = useLocalStorage('LOCAL_STORAGE_KEY', initialValue)
```

<!--

### `let [value, setValue] = useQueryParam(name, default|type)`

`useState` with persistency to query string. `default` value indicates data type to serialize. If default value doesn't exist, directly type can be passed.

```js
```

### `let [values, setValues] = useQueryString()`

Query string object accessor.

### `let [prop, setProp] = useProperty(element, name)`

Property observer hook.

### `let [attr, setAttr] = useAttribute(element, name)`

Element attribute observer hook.

### `let [data, setData] = useDataset(element, name)`

`dataset`/`data-*` observer hook.

### `let [cls, setClass] = useClassName(element, name)`

`className` observer hook.

### `let [values, setValues, isValid] = useForm(init, validation)`

Form values accessor hook.

### `let [value, setValue, isValid] = useFormValue(name, init, validate)`

### `let [response, send, isPending] = useRemote(url, method|options?)`

Remote source accessor, a generic AJAX calls hook.

```js
let [users, fetchUsers] = useRemote('/users', 'GET')
useEffect(fetchUsers, [id])

let [data, su]
```

### `let [location, setLocation] = useLocation()`
### `let [params, setRoute] = useRoute('user/:id')`

### `let [e, dispatch] = useEvent(target|selector?, event)`

Events hook.

### `let [cookie, setCookie] = useCookie(name)`


### `let [ mutation, mutate ] = useMutations(selector|element)`

Append, prepend, remove, update etc.

### `let [element, render] = useSelector(selector|element)`

### `let [css, setCss] = useCSS(selector|element?, rule)`

### `let [value] = useArguments()`

### `let [message, send] = useThread(pid)`

### `let [intersects] = useIntersection(elementA, elementB)`

### `let [size, setSize] = useResize(element)`

### `let [, startTransition, isPending] = useTransition()`

### `let [ result, call ] = useFunction(() => {})`

### `let [ result, call ] = useEffect(key?, () => {}, deps?)`

In some way, a gateway to other hooks, same as direct aspect `effect(() => {})`.
But if we follow convention, that's going to become `let [prevResult, call] = useEffect( () => {} | id ); call()`.
If we keep initial `useEffect(fn, deps)` signature, we may extend it to other aspects as `let result = useAction(id|fn, deps)`.
`useEffect` is an extension of the "current" flow, a branch.
`useTransition` is fork.
A possible trigger is - last `deps` argument. If passed - the `write` method is called instantly with the `deps` argument.

```js
useAction((...deps) => {}, deps)
useState(() => {}, deps)
```

-->


## See also

* [enhook](https://ghub.io/enhook) - enable hooks in regular functions.
* [any-hooks](https://ghub.io/any-hooks) - get available installed hooks.
* [remorph](https://ghub.io/remorph) - react/preact-based DOM morphing.

## License

MIT

<p align="right">HK</p>
