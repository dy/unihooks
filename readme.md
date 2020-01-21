# unihooks ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/unihooks/unihooks.svg?branch=master)](https://travis-ci.org/unihooks/unihooks)

Essential hooks toolkit that's usually built manually for react (or alike) app.

[![NPM](https://nodei.co/npm/unihooks.png?mini=true)](https://nodei.co/npm/unihooks/)

<!--
```js
import { useMedia, useQueryParam, useLocalStorage } from 'unihooks'

const MyComponent = () => {
  let [ location, setLocation ] = useMedia()
  let [ id, setId ] = useQueryParam('id', 0)
  let [ cart, setCart ] = useLocalStorage('cart', [])

  // ...
}
```
-->

## Principles

### 1. Any framework

_Unihooks_ are not bound to react and work with any hooks-enabled library:

* [react](https://ghub.io/react)
* [preact](https://ghub.io/preact)
* [haunted](https://ghub.io/haunted)
* [spect](https://ghub.io/spect)
* [neverland](https://ghub.io/neverland)
* [atomico](https://ghub.io/atomico)
* [augmentor](https://ghub.io/augmentor)
* [dom-augmentor](https://ghub.io/dom-augmentor)
* [fuco](https://ghub.io/fuco)
* [tng-hooks](https://ghub.io/tng-hooks)
* [fn-with-hooks](https://ghub.io/fn-with-hooks)
* [unhook](https://ghub.io/unhook)
* ... see [any-hooks](https://ghub.io/any-hooks) for full list


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

_Unihooks_ extend `useState` signature for intuitivity.

```js
let [ state, actions ] = useSource( target?, init | update? )
```

<sub>The signature resembles [upsert](https://github.com/tc39/proposal-upsert), combining _insert_ and _update_ into a single function.</sub>

### 3. Reactive

_Unihooks_ provide live binding to a data source − component is rerendered whenever underlying data changes. Static hooks are avoided.

```js
const MyComponent = () => { let ua = useUserAgent() } // ✘ − user agent never changes
const MyComponent = () => { let ua = navigator.userAgent } // ✔ − direct API must be used instead
```

<!--
## Who Uses Unihooks

* [wishbox](https://wishbox.gift)
* [mobeewave]()
-->

## Hooks

<details>
<summary><strong>useStore</strong></summary>

#### `[value, setValue] = useStore(key, init?)`

Store provider with persistency and changes broadcast. Can be used as robust application model layer.

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

#### `store = createStore(name, init)`

Create store. Can be used outside of components or hookable scope.

Ref: [store](https://ghub.io/store), [broadcast-channel](https://ghub.io/broadcast-channel), [use-store](https://ghub.io/use-store)

</details>

<details>
<summary><strong>useProperty</strong></summary>

#### `[value, setValue] = useProperty(target, path, init?)`

Observe any target property. Defines transparent getter/setter on a target.

```js
let target = { count: 1 }
function MyComponent () {
  const [count, setCount] = useProperty(target, 'count', 1)
}

// trigger update
target.count++
```

</details>

<details>
<summary><strong>useQueryParam</strong></summary>

#### `[value, setValue] = useQueryParam(name, init?)`

`useState` with persistency to query string. Enables `pushstate`, `replacestate` observers, as well as links withing the same origin. Reflects updates back in search string.

```js
function MyComponent () {
  let [id, setId] = useQueryParam('id')
}
```

It observes [`onpopstate`](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate) and [`onpushstate`](https://ghub.io/onpushstate) events to trigger update.

</details>

<details>
<summary><strong>useLocalStorage</strong></summary>

#### `[value, setValue] = useLocalStorage(key, init?)`

`useState` with persistency to local storage by `key`. Unlike `useStore`, provides raw `localStorage` access.
`init` can be a function or initial value. Provides

```js
function Component1 () {
  const [count, setCount] = useLocalStorage('my-count', 1)
}

function Component2 () {
  const [count, setCount] = useLocalStorage('my-count')
  // count === 1

  // updates Component1 as well
  setCount(2)
}

function Component3 () {
  const [count, setCount] = useLocalStorage('another-count', (value) => {
    // ...initialize value from store
    return value
  })
}
```

</details>

<details>
<summary><strong>useSessionStorage</strong></summary>

#### `[value, setValue] = useSessionStorage(key, init?)`

`useLocalStorage` with `sessionStorage` as backend.

```js
function MyComponent () {
  const [count, setCount] = useSessionStorage('count', (value) => {
    // ...initialize value from store
    return value
  })
}
```

</details>

<details>
<summary><strong>useCookie</strong></summary>

#### `[value, setValue] = useCookie(name, init?)`

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

</details>

<details>
<summary><strong>useGlobalCache</strong></summary>

#### `[value, setValue] = useGlobalCache(key, init?)`

Get access to value stored in [globalCache](https://ghub.io/global-cache).

```js
function MyComponent () {
  const [globalValue, setGlobalValue] = useGlobalCache('value')
}
```

</details>

<details>
<summary><strong>useSource</strong></summary>

#### `[value, setValue] = useSource(storage, key, init?)`

Generic customizable storage hook with persistency.
`storage` object provides data to underlying data structure.
Mostly usable for organizing high-level hooks.

```js
let [value, state] = useSource({
  // read value from storage
  get: (key) => myStore.get(key),

  // write value from storage
  set: (key, value) => myStore.set(key, value),

  // compare if value must be written. By default Object.is.
  is: (a, b) => a.toString() === b.toString(),

  // scheduler for persistency
  plan(fn) { let id = setTimeout(fn); return () => clearTimeout(id) }
}, 'foo', initValue)
```

</details>


<!-- - [ ] `useEvent` − subscribe to events -->
<!-- - [ ] `useElement` / `useElements` − query element or elements -->
<details>
<summary><strong>useAttribute</strong></summary>

#### `[attr, setAttr] = useAttribute( element | ref, name)`

Element attribute hook. Serializes value to attribute, creates attribute observer, handles edge-cases. `null`/`undefined` value removes attribute from element.

```js
function MyButton() {
  let [attr, setAttr] = useAttribute(el, 'loading')

  setAttr(true)

  useEffect(() => {
    // remove attribute
    return () => setAttr()
  }, [])
}
```

</details>

<!-- - [ ] `useLocation` − window.location state -->
<!-- - [ ] `useRoute` − `useLocation` with param matching -->
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

<details>
<summary><strong>useElement</strong></summary>

#### `[element] = useElement( selector | element | ref )`

Get element, either from `ref`, by `selector` or directly.

<!-- Updates whenever selected element or `ref.current` changes. -->

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useElement(ref)

  return <input ref={ref} value={value}/>
}
```

</details>

<!--
<details>
<summary><strong>useInput</strong></summary>

#### `[value, setValue] = useInput( name | selector | element | ref )`

Input element serves as data source. `null`/`undefined` values remove attribute from element.
Useful for organizing light input controllers, when input element is governed by other components.
To create UI, see [useFormField](#useFormField).

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useInput(ref)

  return <input ref={ref} value={value}/>
}
```
</details>
-->

<!--
<details>
<summary><strong>useAsyncSource</strong></summary>

#### `let [data, setData, state] = useAsyncSource(source, key, init?)`

Provides access to generic async data source, like message channel, remote data, worker, worklet etc.

```js
function Component () {
  let [data, setData, { loading, sync }] = useAsyncSource(source, '')
}
```
</details>
-->

<!--
<details>
<summary><strong>useChannel</strong></summary>

#### `[value, setValue, state] = useChannel(key: string|symbol, init?: any )`

Provides data channel for intercommunication between components. Can be used as a temporary shared state without persistency - instead of exposing props on elements or persisting storage.

</details>
-->

<!-- - [ ] `useResource` − async source with state -->
<!-- - [ ] `useSharedState` − state, shared between browser tabs -->
<!-- - [ ] `useSharedStorage` − state, shared between browser tabs -->
<!-- - [ ] `useFiles` -->
<!-- - [ ] `useDB` -->
<!-- - [ ] `useClipboard` -->
<!-- - [ ] `useFavicon` -->
<!-- - [ ] `useRemote` -->


<!-- - [ ] `useProps` − component props (view) provider. -->
<!-- - [ ] `useRender` + `createRender` − render (view) provider, instead of direct result. -->
<!-- - [ ] `useHistory` − -->
<!-- - [ ] `useHotkey` -->




<!-- ## State -->

<details>
<summary><strong>usePrevious</strong></summary>

#### `[prev] = usePrevious(value)`

Returns the previous state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

```js
import { usePrevious, useState, useRender } from 'unihooks';

const Demo = () => {
  const [count, setCount] = useState(0);
  const [prevCount] = usePrevious(count);

  return <p>
    <button onClick={() => setCount(count + 1)}>+</button>
    <button onClick={() => setCount(count - 1)}>-</button>
    <p>
      Now: {count}, before: {prevCount}
    </p>
  </p>
};
```

</details>

<details>
<summary><strong>useCountdown</strong></summary>

#### `[n, reset] = useCountdown(startValue, interval=1000)`

Countdown state from `startValue` down to `0` with indicated `interval` in ms. Provides robust [worker-timers](https://ghub.io/worker-timers)-based implementation (leaving tab does not break timer).

```js
import { useCountdown } from 'unihooks'

const Demo = () => {
  const [count, reset] = useCountdown(30);

  return `Remains: ${count}s`
};
```
</details>

<!--
<details>
<summary><strong>useThrottle</strong></summary>
</details>

<!-- - [ ] `useDefined` -->
<!-- - [ ] `useCounter` − track state of a number -->

<!--
<details>
<summary><strong>useValidate</strong></summary>

#### `[errorMessage, validate] = useValidate(validator: Function | Array)`

Validator hook. Useful as replacement for heavy form hooks.
`validator` is a function or an array of functions.
A validator function takes value argument and returns `true` / `undefined`, if validation passes.
Any other returned result is considered validation error.

Example 1: input validator

```js
function MyComponent () {
  let [usernameError, validateUsername] = useValidate([
    value => !value ? 'Username is required' : true,
    value => value.length < 2 ? 'Username must be at least 2 chars long' : true
  ])

  return <input onChange={e => validateUsername(e.target.value) && handleInputChange(e) } {...inputProps}/>
}
```

Example 2: aspect with `useInput`

```js
function MyAspect () {
  let [value, setValue] = useInput('username')
  let [error, validate] = useValidate(value => !!value)

  useEffect(() => validate(value), [value])
  useEffect(() => if (error) console.log('Invalid:', error), [error])
}
```
</details>
-->

<details>
<summary><strong>useState</strong> <kbd>standard</kbd></summary>

#### `[value, setValue] = useState( init, deps=[] )`

Standard `useState` with additional optional `deps` param, that reinitializes input when deps change.

</details>

<!--

* useLiveState

Provides live binding hook - the value is updated automatically if `setValue` is called.
Limited by the number of available bindings.


* useDiffState

Triggers state update only if new value differs from the prev value.

-->





<!-- ## Action -->

<details>
<summary><strong>useAction</strong></summary>


#### `[result, action] = useAction(name?, fn)`

Actions provider − stores hooks-enabled functions in cache and fetches them on demand. Can be used to organize controllers layer.
If `name` is omitted, function name is used as directly. Actions can use hooks, but they're not reactive: changing state does not trigger rendering.

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

#### `action = createAction(name?, fn)`

Register new action, can be used independent of main component scope.

```js
createAction('show-popup', () => {
  myPopup.show()
})

function Component () {
  let showPopup = useAction('show-popup')
  // same as
  // let [result, showPopup] = useAction('show-popup')

  let button = useElement('.my-button')
  button.onclick = showPopup
}
```
</details>

<details>
<summary><strong>useSyncEffect</strong></summary>

`useEffect` that is run immediately, unlike `useLayoutEffect`. Can be used as deps-gate.

</details>

<details>
<summary><strong>useEffect</strong> <kbd>standard</kbd></summary>

#### `[value, setValue] = useEffect( init, deps?, schedule = fn => queueMicrotask(fn) )`

Standard `useEffect` with optional scheduler. By default effect is run as microtask.

</details>


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

<!--
## UI

<details>
<summary><strong>useFormField</strong></summary>

#### `[ state, actions ] = useFormField({ name, type, validate=(value)=>{}, required, disabled, value, ...inputProps })`
#### `{ value, error, touched, ...inputProps } = state`
#### `{ set, validate, reset, clear } = actions`

Form element state/actions. Useful for building forms UI.

```js
let [ passwordProps, { validate } ] = useFormField({ name: 'password', type: 'password' })

return <input {...passwordProps} />
```
</details>
-->

<!-- - [ ] `useForm` − form state hook -->
<!-- - [ ] `useTable` − table state hook -->
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


## See also

* [enhook](https://ghub.io/enhook) - enable hooks in regular functions.
* [any-hooks](https://ghub.io/any-hooks) - get available installed hooks.
* [remorph](https://ghub.io/remorph) - react/preact-based DOM morphing.

## License

MIT

<p align="right">HK</p>
