# unihook ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/dy/unihook.svg?branch=master)](https://travis-ci.org/dy/unihook)

Unified collection of framework-agnostic common-purpose hooks.

[![NPM](https://nodei.co/npm/unihook.png?mini=true)](https://nodei.co/npm/unihook/)

```js
import { useLocation, useQueryParam, useLocalStorage } from 'unihook'

function MyComponent () {
  // browser location
  let [ location, setLocation ] = useLocation()

  // query string param
  let [ id, setId ] = useQueryString('id', 0)

  // local storage value
  let [ cart, setCart ] = useLocalStorage('cart', [])
}
```

_Unihook_ provides the following common domain hooks:

- local storage
- query string
- target state
- browser location
- html forms
-

_Unihooks_ are available for any framework, supporting hooks. The target framework is detected automatically: `react`, `preact`, `rax`, `augmentor`, `haunted`, `atomico` etc. via [enhook](https://ghub.io/enhook).
If used framework is known in advance, the corresponding entry can be used:

```js
// framework is detected automatically
import * as hook from 'unihook'

// target framework hooks
import * as hook from 'unihook/react'
import * as hook from 'unihook/preact'
import * as hook from 'unihook/rax'
import * as hook from 'unihook/augmentor'
import * as hook from 'unihook/haunted'
import * as hook from 'unihook/atomico'
import * as hook from 'unihook/tng-hooks'
import * as hook from 'unihook/fn-with-hooks'
```


## Docs

_Unihook_ establishes API convention, derived from `useState` / `useTransition`:

```
let [currentValue, changeValue, isPending|isError] = useDataSource( target?, key?, init?, deps? )
```

### `let [state, setState] = useState(target|key?, init, deps?)`

`useState` extension with `target` or `key` first argument and `deps` the last argument. State can be identified, read and reinitialized that way.

```js
let [x, setX] = useState(element, null, [])

// depending on component props - reinit the state
let [value, setValue] = useState(() => props.x, [props.x])
```

Ref: [use-store](https://ghub.io/use-store)

### `let [value, setValue] = useLocalStorage(key, default|init)`

`useState` with persistency to local storage by `key`.

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

<!--
### `let [response, send, isPending] = useRemote(url, method|options?)`

Remote source accessor, a generic AJAX calls hook.

```js
let [users, fetchUsers] = useRemote('/users', 'GET')
useEffect(fetchUsers, [id])

let [data, su]
```
-->

### `let [location, setLocation] = useLocation()`
### `let [params, setRoute] = useRoute('user/:id')`

### `let [e, dispatch] = useEvent(target|selector?, event)`

Events hook.

### `let [cookie, setCookie] = useCookie(name)`


### `let [ mutation, mutate ] = useMutations(selector|element)`

Append, prepend, remove, update etc.

### `let [element, render] = useSelector(selector|element)`

### `let [css, setCss] = useCSS(selector|element?, rule)`

<!-- ### `let [value] = useArguments()` -->

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
