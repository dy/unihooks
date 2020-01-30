# unihooks ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/unihooks/unihooks.svg?branch=master)](https://travis-ci.org/unihooks/unihooks)

Essential hooks collection for everyday react(-ish) projects.

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

<!--
### 1. Framework agnostic

_Unihooks_ are not bound to react and work with any hooks-enabled framework:

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
* ... see [any-hooks](https://ghub.io/any-hooks) for the full list

To switch hooks framework:

```js
import setHooks, { useState, useEffect } from 'unihooks'
import * as preactHooks from 'preact/hooks'

setHooks(preactHooks)
```
-->

<!--
If target framework is known in advance, the corresponding entry can be used:

```js
// framework is detected automatically
import * as hook from 'unihooks'

// preact hooks
import * as hook from 'unihooks/preact'
```
-->

<!--
### 2. Unified

_Unihooks_ extend `useState` signature for intuitivity.

```js
let [ state, actions ] = useValue( target?, init | update? )
```
-->

<!--
<sub>Inspired by [upsert](https://github.com/tc39/proposal-upsert), combining _insert_ and _update_ into a single function.</sub>
-->

<!--
### 3. Reactive

_Unihooks_ provide live binding to a data source − component is rerendered whenever underlying data changes. Static hooks are avoided.

```js
const MyComponent = () => { let ua = useUserAgent() } // ✘ − user agent never changes
const MyComponent = () => { let ua = navigator.userAgent } // ✔ − direct API must be used instead
```
-->

<!--
## Who Uses Unihooks

* [wishbox](https://wishbox.gift)
* [mobeewave]()
-->

<details>
<summary><strong>useValue</strong></summary>

#### `[value, setValue] = useValue(key, init?)`

Global value provider, aka _useChannel_. Can be used as value slot, eg. as application model layer without persistency. Also can be used for intercomponent communication.

```js
import { useValue } from 'unihooks'

function Component () {
  let [users, setUsers] = useValue('users', {
    data: [],
    loading: false,
    current: null
  })

  setUsers({ ...users, loading: true })

  // or as reducer
  setUsers(users => { ...users, loading: false })
}
```
</details>


<details>
<summary><strong>useStorage</strong></summary>

#### `[value, setValue] = useStorage(key, init?, options?)`

`useValue` with persistency to local/session storage.

```js
import { useStorage } from 'unihooks'

function Component1 () {
  const [count, setCount] = useStorage('my-count', 1)
}

function Component2 () {
  const [count, setCount] = useStorage('my-count')
  // count === 1

  setCount(2)
  // (↑ updates Component1 too)
}

function Component3 () {
  const [count, setCount] = useStorage('another-count', (value) => {
    // ...initialize value from store
    return value
  })
}
```

#### `options`

* `prefix` - prefix that's added to stored keys.
* `storage` - manually pass session/local/etc storage.
<!-- * `interval` - persistency interval -->

</details>

<details>
<summary><strong>useSearchParam</strong></summary>

#### `[value, setValue] = useSearchParam(name, init?)`

Reflect value to `location.search`. `value` is turned to string via [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).
To serialize objects or arrays, provide `.toString` method or convert manually.
Turns on `history.pushstate` and `history.replacestate` events, as well as same-origin links listener.

```js
function MyComponent () {
  let [id, setId] = useSearchParam('id')
}
```

</details>

<!--
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
-->

<!--
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
-->

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

<!--
<details>
<summary><strong>useElement</strong></summary>

#### `[element] = useElement( selector | element | ref )`

Get element, either from `ref`, by `selector` or directly.

Updates whenever selected element or `ref.current` changes.

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useElement(ref)

  return <input ref={ref} value={value}/>
}
```

</details>
-->

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
<summary><strong>useCountdown</strong></summary>

#### `[n, reset] = useCountdown(startValue, interval=1000 | schedule?)`

Countdown value from `startValue` down to `0` with indicated `interval` in ms. Alternatively, a scheduler function can be passed as `schedule` argument, that can be eg. [worker-timers](https://ghub.io/worker-timers)-based implementation.

```js
import { useCountdown } from 'unihooks'
import { setInterval, clearInterval } from 'worker-timers'

const Demo = () => {
  const [count, reset] = useCountdown(30, fn => {
    let id = setInterval(fn, 1000)
    return () => clearInterval(id)
  });

  return `Remains: ${count}s`
};
```
</details>


<details>
<summary><strong>useValidate</strong></summary>

#### `[error, validate] = useValidate(validator: Function | Array)`

Provides validation functionality.
`validator` is a function or an array of functions.
A validator function takes value argument and returns `true` / `undefined`, if validation passes.
Any other returned result is considered validation error.


```js
function MyComponent () {
  let [usernameError, validateUsername] = useValidate([
    value => !value ? 'Username is required' : true,
    value => value.length < 2 ? 'Username must be at least 2 chars long' : true
  ])

  return <input onChange={e => validateUsername(e.target.value) && handleInputChange(e) } {...inputProps}/>
}
```
</details>


<details>
<summary><strong>useFormField</strong></summary>

#### `[ props, {value, error, valid, focus, touched, set, reset} ] = useFormField(options)`

Form field state helper. Handles input state and validation.
Useful for organizing controlled inputs or forms, a nice minimal replacement to form hooks.

```js
let field = useFormField({
  name: 'password',
  type: 'password',
  validate: value => !!value
})

return <input {...field[0]} />
```

#### `options`

* `value` - initial input value.
* `persist = false` - persist input state between sessions.
* `validate` - custom validator for input, modifies `error` state. See `useValidate`.
* `required` - quick flag for required validator.
* `...props` - the rest of props is passed to input `props`

<!--
#### `field`

* `value` - current input value
* `error` - current validation error. Revalidated on every value change.
* `valid` - validation state. Focused input is considered valid.
* `focus` - if input is focused.
* `touched` - if user interaction took place.
* `set(value)` - set input value.
* `reset()` - reset input value to initial, clear state.
-->

</details>


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

<!--
<details>
<summary><strong>useThrottle</strong></summary>
</details>

<!-- - [ ] `useDefined` -->
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
<!-- - [ ] `useCounter` − track state of a number -->


<details>
<summary><strong>standard</strong></summary>

For convenience, unihooks export current framework hooks. To switch hooks, use `setHooks` - the default export.

```js
import setHooks, { useState, useEffect } from 'unihooks'
import * as hooks from 'preact/hooks'

setHooks(hooks)

function Timer() {
  let [count, setCount] = useState(0)
  useEffect(() => {
    let id = setInterval(() => setCount(c => ++c))
    return () => clearInterval(id)
  }, [])
}
```

</details>

<details>
<summary><strong>util</strong></summary>

Utility hooks, useful for high-order-hooks.

#### `update = useUpdate()`

Force-update component, regardless of internal state.

#### `prev = usePrevious(value)`

Returns the previous state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

<!--
useSyncEffect
useInit
useDestroy
useResetState
-->

</details>

## See also

* [any-hooks](https://ghub.io/any-hooks) - cross-framework standard hooks provider.
* [enhook](https://ghub.io/enhook) - run hooks in regular functions.

## License

MIT

<p align="right">HK</p>
