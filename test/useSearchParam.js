import t from 'tst'
import { useSearchParam, useState, useEffect } from '../'
import enhook from './enhook.js'
import { tick, idle, frame, time } from 'wait-please'

t.only('useSearchParam: read values properly', async t => {
  clearSearch()
  let log = []

  let str = qs.stringify({
    str: 'foo',
    num: -123,
    bool: false,
    nul: null,
    undef: undefined,
    arr1: [1, 2, 3],
    arr2: ['a', 'b', 'c'],
    arr3: [['a', 1], ['b', 2], ['c', 3]],
    arr4: [{ a: 1 }, { b: 2 }, { c: 3 }],
    obj: { a: 1, b: 2, c: 3, foo: 'bar' },
    date: new Date('2019-11-17')
  }, { encode: false })
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
    log.push(+date)
  })

  f()
  t.deepEqual(log, [
    'foo',
    -123,
    false,
    undefined,
    undefined,
    [1, 2, 3],
    ['a', 'b', 'c'],
    [['a', 1], ['b', 2], ['c', 3]],
    [{ a: 1 }, { b: 2 }, { c: 3 }],
    { a: 1, b: 2, c: 3, foo: 'bar' },
    +new Date('2019-11-17T00:00:00.000Z')
  ])

  await frame(2)
  f.unhook()
  clearSearch()
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
    num: -123,
    bool: false,
    arr1: [1, 2, 3],
    arr2: ['a', 'b', 'c'],
    arr3: [['a', 1], ['b', 2], ['c', 3]],
    arr4: [{ a: 1 }, { b: 2 }, { c: 3 }],
    obj: { a: 1, b: 2, c: 3, foo: 'bar' },
    date: new Date('2019-11-17')
  })
  await frame(2)
  let params = qs.parse(window.location.search.slice(1))
  t.deepEqual(params, {
    "arr1": ["1", "2", "3"],
    "arr2": ["a", "b", "c"],
    "arr3": [["a", "1"], ["b", "2"], ["c", "3"]],
    "arr4": [{ "a": "1" }, { "b": "2" }, { "c": "3" }],
    "bool": "false",
    "date": "2019-11-17T00:00:00.000Z",
    "num": "-123",
    "obj": { "a": "1", "b": "2", "c": "3", "foo": "bar" },
    "str": "foo"
  })

  await frame(3)
  f.unhook()
  clearSearch()
  t.end()
})

t.browser('useSearchParam: defaults', async t => {
  let log = []

  clearSearch()
  await time(10)

  let f = enhook(() => {
    let [str, setStr] = useSearchParam('str', 'foo')
    let [num, setNum] = useSearchParam('num', -123)
    let [bool, setBool] = useSearchParam('bool', false)
    let [arr1, setArr1] = useSearchParam('arr1', [1, 2, 3])
    let [arr2, setArr2] = useSearchParam('arr2', ['a', 'b', 'c'])
    let [arr3, setArr3] = useSearchParam('arr3', [['a', 1], ['b', 2], ['c', 3]])
    let [arr4, setArr4] = useSearchParam('arr4', [{ a: 1 }, { b: 2 }, { c: 3 }])
    let [obj, setObj] = useSearchParam('obj', { a: 1, b: 2, c: 3, foo: 'bar' })
    let [date, setDate] = useSearchParam('date', new Date('2019-11-17'))

    log.push(str)
    log.push(num)
    log.push(bool)
    log.push(arr1)
    log.push(arr2)
    log.push(arr3)
    log.push(arr4)
    log.push(obj)
    log.push(+date)
  })

  f()
  t.deepEqual(log, [
    'foo',
    -123,
    false,
    [1, 2, 3],
    ['a', 'b', 'c'],
    [['a', 1], ['b', 2], ['c', 3]],
    [{ a: 1 }, { b: 2 }, { c: 3 }],
    { a: 1, b: 2, c: 3, foo: 'bar' },
    +new Date('2019-11-17T00:00:00.000Z')
  ])
  await tick()

  let params = qs.parse(window.location.search.slice(1))

  t.deepEqual(params, {
    "arr1": ["1", "2", "3"],
    "arr2": ["a", "b", "c"],
    "arr3": [["a", "1"], ["b", "2"], ["c", "3"]],
    "arr4": [{ "a": "1" }, { "b": "2" }, { "c": "3" }],
    "bool": "false",
    "date": "2019-11-17T00:00:00.000Z",
    "num": "-123",
    "obj": { "a": "1", "b": "2", "c": "3", "foo": "bar" },
    "str": "foo"
  })


  f.unhook()
  await time(100)
  clearSearch()
  t.end()
})

t('useSearchParam: custom toString method')

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
  t.deepEqual(log, [1, 2])

  window.history.pushState(null, "useSearchParam", "?x=3");
  await frame(3)
  t.deepEqual(log, [1, 2, 3])

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

function clearSearch() {
  window.history.pushState(null, '', window.location.href.split('?')[0])
}
