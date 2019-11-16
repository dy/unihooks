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

#### 1. Cross-framework

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

#### 2. Unified

_Unihooks_ follow generalized API signature, derived from `useState`/`useEffect`:

<!-- / `useEffect` and Observable / Promise: -->

```
let [ state, action ] = useDomain( key?, init | fn?, deps? )
```

<!-- let [ value, { error, closed, pending } ] = useCall( fn, deps? ) -->

#### 3. Reactive

Hooks observe some changing data source and trigger update. Static hooks are not allowed.

```js
// no
const MyComponent = () => { let ua = useUserAgent() }

// yes
const MyComponent = () => { let ua = useMemo(() => navigator.userAgent, []) }
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
`init` can be a function or initial value. `deps` can indicate if `init` must be called (same as `useEffect`).

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

<!--
#### `useStorage(key, init, { get, set })`

Generic storage hook

```js
```
-->

### Standard Hooks

#### `useState(init, deps?)`

Normalized `useState` across frameworks.

1. Makes sure initialized works - augmentor and possibly other frameworks had it not supported.
2. Takes optional `deps` param to trigger initializer. That can be useful for components, depending on props.

```js
function MyComponent(props) {
  let [currentValue, setCurrentValue] = useState(props.value, [props.value])
  // sets `currentValue` to `value` whenever passed `props.value` changes.
}
```

#### `useEffect(fn, deps?)`

Deopinionated `useEffect`.

1. It guarantees microtask - react/preact behave unpredictably for whether effect is called as microtask or synchronously.
2. No-deps call `useEffect(fn)` is equivalent to empty-array call `useEffect(fn, [])`. First, this is compatible with `useState(initFn)` (principle 2). Second, react's `useEffect(fn)` is equivalent to `queueMicrotask(fn)`, that violates principle 3. Third, single-run `useEffect(fn)` is equivalent to `useInit(fn)`/`useMount(fn)`, that reduces lib size and makes for principle 1.

```js

```

<!--

#### `let [value, setValue] = useQueryParam(name, default|type)`

`useState` with persistency to query string. `default` value indicates data type to serialize. If default value doesn't exist, directly type can be passed.

```js
```

#### `let [values, setValues] = useQueryString()`

Query string object accessor.

#### `let [prop, setProp] = useProperty(element, name)`

Property observer hook.

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
