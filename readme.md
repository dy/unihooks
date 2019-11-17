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

### 1. Universal

_Unihooks_ work in any hooks-enabled framework:

* [react](https://ghub.io/react)
* [preact](https://ghub.io/preact)
* [haunted](https://ghub.io/haunted)
* [atomico](https://ghub.io/atomico)
* [augmented](https://ghub.io/augmented)

<!--
If target framework is known in advance, the corresponding entry can be used:

```js
// framework is detected automatically
import * as hook from 'unihooks'

// preact hooks
import * as hook from 'unihooks/preact'
```
-->

### 2. Uniform

_Unihooks_ follow `useState` or `useEffect` API signature.

```
let [ state, action ] = useDomain( key?, init? )
useEffect( fn, deps?)
```

### 3. Essential

Hooks are reactive - they observe some data source and trigger update. Static hooks, or hooks that can be replaced with native API are not allowed.

```js
// no
const MyComponent = () => { let ua = useUserAgent() }

// yes
const MyComponent = () => { let ua = navigator.userAgent }
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

### Data hooks

#### `useLocalStorage(key, init?, deps?)`

`useState` with persistency to local storage by `key`.
`init` can be a function or initial value. `deps` can indicate if value must be reinitialized.

```js
function MyComponent1 () {
  const [count, setCount] = useLocalStorage('my-count', 1)
}

function MyComponent2 () {
  const [count, setCount] = useLocalStorage('my-count')
  // count === 1

  // updates MyComponent1 as well
  setCount(2)
}

function MyComponent3 () {
  const [count, setCount] = useLocalStorage('another-count', (value) => {
    // ...initialize value from store
    return value
  })
}
```

#### `useQueryParam(name, init?, deps?)`

`useState` with persistency to query string. `default` value indicates data type to serialize.

```js
let [value, setValue] = useQueryParam(name, default)
```

<!--

#### `useHistory()`

```js
let [state, { back, forward, go }] = useHistory()
```

#### `useHash()`

```js
let [ref, setRef] = useHash()
```

#### `useLocation()`

```js
let [location, setLocation] = useLocation()
```

-->

#### `useProperty(target, path, init?, deps?)`

Observe target property.

```js
let target = { count: 1 }
function MyComponent () {
  const [count, setCount] = useProperty(target, 'count', 1)
}
```

<!--
#### `useGlobalCache(key, init?)`

Get value stored as global.

```js
```

-->

#### `useStorage(storage, init?, deps?)`

Generic storage hook. Storage is `{ get, set }` object, providing access to some underlying data structure.


<!--

#### `let [attr, setAttr] = useAttribute(element, name)`

Element attribute observer hook.

#### `let [data, setData] = useDataset(element, name)`

`dataset`/`data-*` observer hook.

#### `let [cls, setClass] = useClassName(element, name)`

`className` observer hook.

#### `let [values, setValues, isValid] = useForm(init, validation)`

Form values accessor hook.

#### `let [value, setValue, isValid] = useFormValue(name, init, validate)`

#### `let [response, send, isPending] = useRemote(url, method|options?)`

Remote source accessor, a generic AJAX calls hook.

```js
let [users, fetchUsers] = useRemote('/users', 'GET')
useEffect(fetchUsers, [id])

let [data, su]
```

#### `let [location, setLocation] = useLocation()`
#### `let [params, setRoute] = useRoute('user/:id')`

#### `let [e, dispatch] = useEvent(target|selector?, event)`

Events hook.

#### `let [cookie, setCookie] = useCookie(name)`


#### `let [ mutation, mutate ] = useMutations(selector|element)`

Append, prepend, remove, update etc.

#### `let [element, render] = useSelector(selector|element)`

#### `let [css, setCss] = useCSS(selector|element?, rule)`

#### `let [value] = useArguments()`

#### `let [message, send] = useThread(pid)`

#### `let [intersects] = useIntersection(elementA, elementB)`

#### `let [size, setSize] = useResize(element)`

#### `let [, startTransition, isPending] = useTransition()`

#### `let [ result, call ] = useFunction(() => {})`

#### `let [ result, call ] = useEffect(key?, () => {}, deps?)`

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
