# unihooks ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/unihooks/unihooks.svg?branch=master)](https://travis-ci.org/unihooks/unihooks)

Essential unified multi-framework hooks.

[![NPM](https://nodei.co/npm/unihooks.png?mini=true)](https://nodei.co/npm/unihooks/)

```js
import { useMedia, useQueryParam, useLocalStorage } from 'unihooks'

const MyComponent = () => {
  let [ location, setLocation ] = useMedia()
  let [ id, setId ] = useQueryParam('id', 0)
  let [ cart, setCart ] = useLocalStorage('cart', [])

  // ...
}
```

## Principles

### 1. Multi-framework

_Unihooks_ work with any hooks-enabled library:

[react](https://ghub.io/react), [preact](https://ghub.io/preact), [haunted](https://ghub.io/haunted), [neverland](https://ghub.io/neverland), [atomico](https://ghub.io/atomico), [augmentor](https://ghub.io/augmentor), [dom-augmentor](https://ghub.io/dom-augmentor), [spect](https://ghub.io/spect), [fuco](https://ghub.io/fuco), [tng-hooks](https://ghub.io/tng-hooks), [fn-with-hooks](https://ghub.io/fn-with-hooks), [unhook](https://ghub.io/unhook), ...

<!--
If target framework is known in advance, the corresponding entry can be used:

```js
// framework is detected automatically
import * as hook from 'unihooks'

// preact hooks
import * as hook from 'unihooks/preact'
```
-->

### 2. Unified

_Unihooks_ follow `useState` / `useEffect` API signature.

```js
let [ state, action ] = useData( key?, init? )
let result = useCall( fn, deps? )
```

### 3. Essential

_Unihooks_ provide extra value, related to reactivity. Static hooks, or hooks that can be replaced with native API are excluded.

```js
const MyComponent1 = () => { let ua = useUserAgent() } // ✘
const MyComponent2 = () => { let ua = navigator.userAgent } // ✔
```

## Who Uses Unihooks

* [wishbox](https://wishbox.gift)
* [mobeewave]()

## Hooks

#### App / MVC

- [x] `useStore` + `createStore` − store (model) provider, persistable contextless `useState`.
- [x] `useAction` + `createAction` − action (controller) provider, contextless `useEffect` with result.
<!-- - [ ] `useProps` − component props (view) provider. -->
<!-- - [ ] `useRender` + `createRender` − render (view) provider, instead of direct result. -->
<!-- - [ ] `useHistory` − -->
<!-- - [ ] `useHotkey` -->

<!-- #### State -->

<!-- - [ ] `useState` − normalized standard `useState` -->
- [x] `usePrevious` − return the previous state or props.
- [x] `useCountdown` − countdown state.
<!-- - [x] `useThrottle` − throttle state value. -->
<!-- - [ ] `useDefined` -->
<!-- - [ ] `useCounter` − track state of a number -->

<!-- #### Effects -->

- [x] `useEffect` − normalized standard `useEffect` with async fn support.
- [x] `useSyncEffect` − `useEffect` with synchronous invocation.
- [x] `useInit` − `useSyncEffect`, called once.
<!-- - [ ] `useDestroy` -->
<!-- - [ ] `useEffectDeep` -->
<!-- - [ ] `useUpdate` -->
<!-- - [ ] `useTween` -->
<!-- - [ ] `useTimeout` -->
<!-- - [ ] `useInterval` -->
<!-- - [ ] `useIdle` -->
<!-- - [ ] `useImmediate` -->
<!-- - [ ] `useRaf` -->
<!-- - [ ] `useToggle` -->
<!-- - [ ] `usePing` -->
<!-- - [ ] `useFSM` -->
<!-- - [ ] `useAsync` -->
<!-- - [ ] `useHooked` - run hooks-enabled effect -->

<!-- #### Data -->

- [x] `useProperty` − any object/target property observer.
- [x] `useQueryParam` − `useState` with persistency to search string parameter.
- [x] `useLocalStorage` − `useState` with persistency to local storage.
- [x] `useSessionStorage` − `useState` with persistency to session storage.
- [x] `useCookie` − `useState` with persistency to cookies.
- [x] `useGlobalCache` − [global-cache](https://ghub.io/global-cache) storage.
- [x] `useStorage` − generic storage hook with scheduling persistency.
- [ ] `useChannel` − intercommunication between components.
<!-- - [ ] `useSharedState` − state, shared between browser tabs -->
<!-- - [ ] `useSharedStorage` − state, shared between browser tabs -->
<!-- - [ ] `useFiles` -->
<!-- - [ ] `useDB` -->
<!-- - [ ] `useClipboard` -->
<!-- - [ ] `useFavicon` -->
<!-- - [ ] `useRemote` -->

<!-- #### DOM -->

<!-- - [ ] `useEvent` − subscribe to events -->
<!-- - [ ] `useElement` / `useElements` − query element or elements -->
- [x] `useAttribute` − element attribute state
<!-- - [ ] `useLocation` − browser location -->
<!-- - [ ] `useData` − read / write element dataset -->
<!-- - [ ] `useClass` − manipulate element `classList` -->
<!-- - [ ] `useMount` − `onconnected` / `ondisconnected` events -->
<!-- - [ ] `useStyle` − set element style -->
<!-- - [ ] `usePermission` -->
<!-- - [ ] `useTitle` -->
<!-- - [ ] `useMeta` -->
<!-- - [ ] `useRoute` -->
<!-- - [ ] `useMutation` − -->
<!-- - [ ] `useHost` −  -->

<!-- #### UI -->

- [ ] `useInput` − input field state
<!-- - [ ] `useForm` − form builder helper -->
<!-- - [ ] `useTable` − table builder helper -->
<!-- - [ ] `useDialog` − dialog builder helper -->
<!-- - [ ] `useMenu` − menu builder helper -->
<!-- - [ ] `useToast` − toast builder helper -->
<!-- - [ ] `usePopover` − popover builder helper -->
<!-- - [ ] `useLocale` − -->

<!-- #### Appearance -->

<!-- - [ ] `useMedia` -->
<!-- - [ ] `useCSS` -->
<!-- - [ ] `useSize` -->
<!-- - [ ] `useFullscreen` -->
<!-- - [ ] `useAudio` -->
<!-- - [ ] `useSpeech` -->
<!-- - [ ] `useLockBodyScroll` -->

<!-- #### Interaction -->

<!-- - [ ] `useHover` − hover state of an element -->
<!-- - [ ] `useEvent` − subscribe to an event -->
<!-- - [ ] `useResize` − track element size -->
<!-- - [ ] `useIntersection` − track element intersection via Intersection observer -->
<!-- - [ ] `useDrag` / `useDrop` − drag / drop interaction helper -->
<!-- - [ ] `useIdle` − track idle state -->
<!-- - [ ] `useMove` − track mouse/pointer move with inertia -->
<!-- - [ ] `usePan` − track panning -->
<!-- - [ ] `useZoom` − track zoom -->
<!-- - [ ] `useKey` − track key press -->
<!-- - [ ] `useShortcut` − track combination of keys -->
<!-- - [ ] `useArrows` − track arrows -->
<!-- - [ ] `useTyping` − detect if user is typing -->
<!-- - [ ] `useScrolling` − detect if user is scolling -->
<!-- - [ ] `usePageLeave` − -->
<!-- - [ ] `useScroll` − -->
<!-- - [ ] `useClickAway` − -->
<!-- - [ ] `useFocusOutside` − -->

<!-- #### Hardware -->

<!-- - [ ] `useNetwork` -->
<!-- - [ ] `useOrientation` -->
<!-- - [ ] `useMedia` -->
<!-- - [ ] `useAccelerometer` -->
<!-- - [ ] `useBattery` -->
<!-- - [ ] `useGeolocation` -->
<!-- - [ ] `useMediaDevices` -->
<!-- - [ ] `useVibrate` -->
<!-- - [ ] `useMotion` -->

<!-- #### Async / Stream -->

<!-- - [ ] `useStream` -->
<!-- - [ ] `useObservable` -->
<!-- - [ ] `useAsyncIterator` -->
<!-- - [ ] `useGenerator` -->
<!-- - [ ] `usePromise` -->
<!-- - [ ] `useEmitter` -->

<!-- #### Standard -->

<!-- - [ ] `useState` -->
<!-- - [ ] `useEffect` -->
<!-- - [ ] `useMemo` -->
<!-- - [ ] `useCallback` -->
<!-- - [ ] `useContext` -->
<!-- - [ ] `useReducer` -->
<!-- - [ ] `useLayoutEffect` -->
<!-- - [ ] `useRef` -->

<!--

### let [state, setState] = useState(target|key?, init, deps?)

`useState` extension with `target` or `key` first argument and `deps` the last argument. State can be identified, read and reinitialized that way.

```js
let [x, setX] = useState(element, null, [])

// depending on component props - reinit the state
let [value, setValue] = useState(() => props.x, [props.x])
```

Ref: [use-store](https://ghub.io/use-store)

-->

## API

### useStore

<table><tr><td> [value, setValue]</td><td>=</td><td>useStore(key, init?)</td></tr></table>

Store provider with persistency and changes broadcasting. Can be used as robust application model layer.

```js
import { createStore, useStore } from 'unihooks'

createStore('users', {
  data: [],
  loading: false,
  current: null
})

function Component () {
  let [users, setUsers] = useStore('users')

  setUsers({ ...users, loading: true })

  // or as reducer
  setUsers(users => { ...users, loading: false })
}
```

<table><tr><td> store</td><td>=</td><td>createStore(name, init)</td></tr></table>

Create store. Can be used outside of components or hookable scope.

Ref: [store](https://ghub.io/store), [broadcast-channel](https://ghub.io/broadcast-channel), [use-store](https://ghub.io/use-store)


### useAction

<table><tr><td> [result, action]</td><td>=</td><td>useAction(name?, fn?)</td></tr></table>

App action provider. Can be used to organize application controllers. If `name` is omitted, function name is used as directly.
Actions can use hooks, but they're not reactive: changing state does not cause self-recursion.

```js
createAction('load-collection', async (id) => {
  // actions can use hooks internally
  let [collection, setCollection] = useStore('collection')
  setCollection({ ...collection, loading: true})
  setCollection({ data: await load(`collection/${id}`), loading: false })

  return collection
})

function MyComponent() {
  let [collection, load] = useAction('load-collection')

  useEffect(() => {
    let data = await load(id)
  }, [id])
}
```

<table><tr><td> action</td><td>=</td><td>createAction(name?, fn)</td></tr></table>

Register new action, can be used independent of components/hooked scope.

<!--
### [props, setProps] = useProps(target, defaults?)

Provides target element/object props. Useful for organizing component API.
Unlike `useAttribute`/`useProperty`, `useProps` handles both attributes/properties.

```js
function MyComponent () {
  const [] = useProps(element)
}
```
-->


### useLocalStorage

<table><tr><td> [value, setValue]</td><td>=</td><td>useLocalStorage(key, init?)</td></tr></table>

`useState` with persistency to local storage by `key`. Unlike `useStore`, provides raw `localStorage` access.
`init` can be a function or initial value. Provides

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

### useSessionStorage

<table><tr><td> [value, setValue]</td><td>=</td><td>useSessionStorage(key, init?)</td></tr></table>

`useLocalStorage` with `sessionStorage` as backend.

```js
function MyComponent () {
  const [count, setCount] = useSessionStorage('count', (value) => {
    // ...initialize value from store
    return value
  })
}
```


### useQueryParam

<table><tr><td> [value, setValue]</td><td>=</td><td>useQueryParam(name, init?)</td></tr></table>

`useState` with persistency to query string. Enables `pushstate`, `replacestate` observers, as well as links withing the same origin. Reflects updates back in search string.

```js
function MyComponent () {
  let [id, setId] = useQueryParam('id')
}
```

It observes [`onpopstate`](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate) and [`onpushstate`](https://ghub.io/onpushstate) events to trigger update.


<!--

### useHistory()

```js
let [state, { back, forward, go }] = useHistory()
```

### useHash()

```js
let [ref, setRef] = useHash()
```

### useLocation()

```js
let [location, setLocation] = useLocation()
```

-->

### useCookie

<table><tr><td> [value, setValue]</td><td>=</td><td>useCookie(name, init?)</td></tr></table>

Cookies accessor hook.

```js
function MyComponent () {
  const [cookie, setCookie] = useCookie('foo')

  useEffect(() => {
    setCookie('baz')
  })
}
```

Does not observe cookies (there's no implemented API for that).


### useProperty

<table><tr><td> [value, setValue]</td><td>=</td><td>useProperty(target, path, init?)</td></tr></table>

Observe any target property. Defines transparent getter/setter on a target.

```js
let target = { count: 1 }
function MyComponent () {
  const [count, setCount] = useProperty(target, 'count', 1)
}

// trigger update
target.count++
```

### useGlobalCache

<table><tr><td> [value, setValue]</td><td>=</td><td>useGlobalCache(key, init?)</td></tr></table>

Get access to value stored in [globalCache](https://ghub.io/global-cache).

```js
function MyComponent () {
  const [globalValue, setGlobalValue] = useGlobalCache('value')
}
```

### useStorage

<table><tr><td> [value, setValue] = useStorage(storage, key, init?)</td></tr></table>

Generic customizable storage hook with persistency.
`storage` object provides data to some underlying data structure.

```js
useStorage({
  // read value from storage
  get: (key) => myStore.get(key),

  // write value from storage
  set: (key, value) => myStore.set(key, value),

  // compare if value must be written. By default Object.is.
  is: (a, b) => a.toString() === b.toString(),

  // scheduler for persistency
  plan(fn) { let id = setTimeout(fn); return () => clearTimeout(id) }
})
```

### usePrevious

<table><tr><td> [prev]</td><td>=</td><td>usePrevious(value)</td></tr></table>

Returns the previous state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

```js
import { usePrevious, useState, useRender } from 'unihooks';

const Demo = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return <p>
    <button onClick={() => setCount(count + 1)}>+</button>
    <button onClick={() => setCount(count - 1)}>-</button>
    <p>
      Now: {count}, before: {prevCount}
    </p>
  </p>
};
```

### useCountdown

<table><tr><td> [n, reset]</td><td>=</td><td>useCountdown(start, interval=1000)</td></tr></table>

Countdown state from `start` down to `0` with indicated `interval`. Provides robust [worker-timers](https://ghub.io/worker-timers)-based implementation (leaving tab does not break timer).

```js
import { useCountdown } from 'unihooks'

const Demo = () => {
  const [count, reset] = useCountdown(30);

  return `Remains: ${count}s`
};
```


### useAttribute

<table><tr><td> [attr, setAttr]</td><td>=</td><td>useAttribute(element|ref, name)</td></tr></table>

Element attribute hook. Serializes value to attribute, creates attribute observer, handles edge-cases. `null`/`undefined` values remove attribute from element.

```js
function MyButton() {
  let [attr, setAttr] = useAttribute(el, 'loading')

  setAttr(true)
}
```

### useInput

<table><tr><td> [value, setValue]</td><td>=</td><td>useInput( name|selector|element|ref )</td></tr></table>

Input element hook. Serializes value to input, creates input observer, handles edge-cases. `null`/`undefined` values remove attribute from element.

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useInput(ref)

  return <input ref={ref} value={value}/>
}
```

<!--
### let [data, setData] = useDataset(element, name)

`dataset`/`data-*` observer hook.

### let [cls, setClass] = useClassName(element, name)

`className` observer hook.

### let [values, setValues, isValid] = useForm(init, validation)

Form values accessor hook.

### let [value, setValue, isValid] = useFormValue(name, init, validate)

### let [response, send, isPending] = useRemote(url, method|options?)

Remote source accessor, a generic AJAX calls hook.

```js
let [users, fetchUsers] = useRemote('/users', 'GET')
useEffect(fetchUsers, [id])

let [data, su]
```

### let [location, setLocation] = useLocation()
### let [params, setRoute] = useRoute('user/:id')

### let [e, dispatch] = useEvent(target|selector?, event)

Events hook.


### let [ mutation, mutate ] = useMutations(selector|element)

Append, prepend, remove, update etc.

### let [element, render] = useSelector(selector|element)

### let [css, setCss] = useCSS(selector|element?, rule)

### let [] = useMediaQuery()

### useNetworkStatus()

### let [value] = useArguments()

### let [message, send] = useThread(pid)

### let [intersects] = useIntersection(elementA, elementB)

### let [size, setSize] = useResize(element)

### let [, startTransition, isPending] = useTransition()

### let [ result, call ] = useFunction(() => {})

### let [ result, call ] = useEffect(key?, () => {}, deps?)

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
