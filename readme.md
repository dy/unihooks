# unihook

Unified collection of hooks, followin established API convention for intuitivity.

```js
```

_Unihook_ establishes generic hook API pattern, based on `useState` and `useTransition` hooks:

```js
let [lastValue, setValue, isPending?] = useDataSource(...params)
```


## Docs

### `let [state, setState] = useState(target?, init)`

### `let [value, setValue] = useLocalStorage(key)`

### `let [intersects] = useIntersection(elementA, elementB)`

### `let [size, setSize] = useResize(element)`

### `let [e, dispatch] = useEvent(target|selector?, event)`

### `let [value, setValue] = useQueryString(key, type=String)`

### `let [ mutation, mutate ] = useMutations(selector|element)`

Append, prepend, remove, update etc.

### `let [response, send, isPending] = useRemote(url, method|options?)`

### `let [attr, setAttr] = useAttribute(element, name)`

### `let [prop, setProp] = useProp(element, name)`

### `let [data, setData] = useData(element, name)`

### `let [content, setContent] = useHTML(selector|element)`

### `let [css, setCss] = useCSS(selector|element?, rule)`

### `let [cookie, setCookie] = useCookie()`

### `let [values, setValues] = useForm()`
