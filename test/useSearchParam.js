import t from 'tst'
import { useSearchParam } from '../'
import enhook from './enhook.js'
import { tick, idle, frame, time } from 'wait-please'

t.browser('useSearchParam: read values properly', async t => {
  clearSearch()
  let log = []

  let str = new URLSearchParams({
    str: 'foo',
    num: -123,
    bool: false,
    nul: null,
    undef: undefined,
    arr1: [1, 2, 3],
    arr2: ['a', 'b', 'c'],
    arr3: [['a', 1], ['b', 2], ['c', 3]],
    arr4: [
      { a: 1, toString() {return 'a:' + this.a} },
      { b: 2, toString() { return 'b:' + this.b } },
      { c: 3, toString() { return 'c:' + this.c } }
    ],
    obj: { a: 1, b: 2, c: 3, foo: 'bar', toString(){return JSON.stringify(this)} },
    date: +new Date('2019-11-17')
  }).toString()
  window.history.pushState(null, '', '?' + str)

  let f = enhook(() => {
    let [str, setStr] = useSearchParam('str')
    let [num, setNum] = useSearchParam('num')
    let [bool, setBool] = useSearchParam('bool')
    let [nul, setNul] = useSearchParam('nul')
    let [undef, setUndef] = useSearchParam('undefined')
    let [arr1, setArr1] = useSearchParam('arr1')
    let [arr2, setArr2] = useSearchParam('arr2')
    let [arr3, setArr3] = useSearchParam('arr3')
    let [arr4, setArr4] = useSearchParam('arr4')
    let [obj, setObj] = useSearchParam('obj')
    let [date, setDate] = useSearchParam('date')

    log.push(str)
    log.push(num)
    log.push(bool)
    log.push(nul)
    log.push(undef)
    log.push(arr1)
    log.push(arr2)
    log.push(arr3)
    log.push(arr4)
    log.push(obj)
    log.push(date)
  })

  f()
  t.deepEqual(log, [
    'foo',
    '-123',
    'false',
    'null',
    undefined,
    '1,2,3',
    'a,b,c',
    'a,1,b,2,c,3',
    'a:1,b:2,c:3',
    '{"a":1,"b":2,"c":3,"foo":"bar"}',
    +new Date('2019-11-17T00:00:00.000Z') + ''
  ])

  f.unhook()
  clearSearch()
  await frame(5)
  t.end()
})

t.browser('useSearchParam: write values', async t => {
  clearSearch()

  let f = enhook((params) => {
    let [str, setStr] = useSearchParam('str')
    let [num, setNum] = useSearchParam('num')
    let [bool, setBool] = useSearchParam('bool')
    let [arr1, setArr1] = useSearchParam('arr1')
    let [arr2, setArr2] = useSearchParam('arr2')
    let [arr3, setArr3] = useSearchParam('arr3')
    let [arr4, setArr4] = useSearchParam('arr4')
    let [obj, setObj] = useSearchParam('obj')
    let [date, setDate] = useSearchParam('date')

    setStr(params.str)
    setNum(params.num)
    setBool(params.bool)
    setArr1(params.arr1)
    setArr2(params.arr2)
    setArr3(params.arr3)
    setArr4(params.arr4)
    setObj(params.obj)
    setDate(params.date)
  })

  f({
    str: 'foo',
    num: -124,
    bool: false,
    arr1: [1, 2, 3],
    arr2: ['a', 'b', 'c'],
    arr3: [['a', 1], ['b', 2], ['c', 3]],
    arr4: [
      { a: 1, toString() { return 'a:' + this.a } },
      { b: 2, toString() { return 'b:' + this.b } },
      { c: 3, toString() { return 'c:' + this.c } }
    ],
    obj: { a: 1, b: 2, c: 3, foo: 'bar', toString(){return JSON.stringify(this)} },
    date: new Date('2019-11-17').toISOString()
  })
  await frame(2)
  let params = new URLSearchParams(window.location.search.slice(1))
  t.is(params.get("arr1"), "1,2,3")
  t.is(params.get("arr2"), "a,b,c")
  t.is(params.get("arr3"), "a,1,b,2,c,3")
  t.is(params.get("arr4"), "a:1,b:2,c:3")
  t.is(params.get("bool"), "false")
  t.is(params.get("date"), "2019-11-17T00:00:00.000Z")
  t.is(params.get("num"), "-124")
  t.is(params.get("obj"), JSON.stringify({ "a": 1, "b": 2, "c": 3, "foo": "bar" }))
  t.is(params.get("str"), "foo")

  await frame(3)
  f.unhook()
  // clearSearch()
  await frame(3)
  t.end()
})

t.browser('useSearchParam: defaults', async t => {
  let log = []

  clearSearch()
  await time(100)

  let f = enhook(() => {
    let [str, setStr] = useSearchParam('str', 'foo')
    let [num, setNum] = useSearchParam('num', '-123')
    let [bool, setBool] = useSearchParam('bool', 'false')

    log.push(str)
    log.push(num)
    log.push(bool)
  })

  f()
  t.deepEqual(log, [
    'foo',
    '-123',
    'false'
  ])
  await tick()

  let params = new URLSearchParams(window.location.search.slice(1))

  t.equal(params.get("bool"), "false")
  t.equal(params.get("num"), "-123")
  t.equal(params.get("str"), "foo")


  f.unhook()
  await time(50)
  // clearSearch()
  t.end()
})

t.browser('useSearchParam: observe updates', async t => {
  clearSearch()
  let log = []
  let f = enhook(() => {
    let [v, setV] = useSearchParam('x', 1)
    log.push(v)
  })
  f()
  await frame(2)
  t.deepEqual(log, [1])

  window.history.pushState(null, "useSearchParam", "?x=2");
  await frame()
  t.deepEqual(log, [1, '2'])

  window.history.pushState(null, "useSearchParam", "?x=3");
  await frame(3)
  t.deepEqual(log, [1, '2', '3'])

  f.unhook()
  clearSearch()
  t.end()
})

t.browser('useSearchParam: default array', async t => {
  let f = enhook(() => {
    let [arr, setArr] = useSearchParam('arr', [])
    t.deepEqual(arr, [])
  })
  f()

  await frame(2)
  f.unhook()
  clearSearch()
  t.end()
})

t.browser('useSearchParam: init from empty string', async t => {
  let log = []

  window.history.pushState(null, '', '?x=1')
  let f = enhook(() => {
    let [x] = useSearchParam('x', '')
    log.push(x)
  })
  f()
  t.deepEqual(log, ['1'])

  f.unhook()

  clearSearch()
  t.end()
})

function clearSearch() {
  window.history.pushState(null, '', window.location.href.split('?')[0])
}
