import t from 'tape'
import { useQueryParam, useState, useEffect } from '..'
import enhook from 'enhook'
// import { decode, qs.stringify } from 'qss'
import qs from 'qs'
import { tick, idle, frame, time } from 'wait-please'

let isNode = !!(typeof process !== 'undefined' && process.versions && process.versions.node)

!isNode && t('useQueryParam: read values properly', async t => {
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
    arr4: [{ a: 1}, {b: 2}, {c: 3}],
    obj: {a:1, b:2, c:3, foo: 'bar'},
    date: new Date('2019-11-17')
  }, { encode: false })
  window.history.pushState(null, '', '?' + str)

  let f = enhook(() => {
    let [str, setStr] = useQueryParam('str')
    let [num, setNum] = useQueryParam('num')
    let [bool, setBool] = useQueryParam('bool')
    let [nul, setNul] = useQueryParam('nul')
    let [undef, setUndef] = useQueryParam('undefined')
    let [arr1, setArr1] = useQueryParam('arr1')
    let [arr2, setArr2] = useQueryParam('arr2')
    let [arr3, setArr3] = useQueryParam('arr3')
    let [arr4, setArr4] = useQueryParam('arr4')
    let [obj, setObj] = useQueryParam('obj')
    let [date, setDate] = useQueryParam('date')

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
    [{a: 1}, {b: 2}, {c: 3}],
    {a: 1, b: 2, c: 3, foo: 'bar'},
    +new Date('2019-11-17T00:00:00.000Z')
  ])

  await frame(2)
  clearSearch()
  t.end()
})

!isNode && t('useQueryParam: write values', async t => {
  clearSearch()

  let f = enhook((params) => {
    let [str, setStr] = useQueryParam('str')
    let [num, setNum] = useQueryParam('num')
    let [bool, setBool] = useQueryParam('bool')
    let [arr1, setArr1] = useQueryParam('arr1')
    let [arr2, setArr2] = useQueryParam('arr2')
    let [arr3, setArr3] = useQueryParam('arr3')
    let [arr4, setArr4] = useQueryParam('arr4')
    let [obj, setObj] = useQueryParam('obj')
    let [date, setDate] = useQueryParam('date')

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

  await frame(2)
  clearSearch()
  t.end()
})

t.skip('useQueryParam: batch update', async t => {
  t.end()
})

!isNode && t('useQueryParam: defaults', async t => {
  let log = []

  clearSearch()

  let f = enhook(() => {
    let [str, setStr] = useQueryParam('str', 'foo')
    let [num, setNum] = useQueryParam('num', -123)
    let [bool, setBool] = useQueryParam('bool', false)
    let [arr1, setArr1] = useQueryParam('arr1', [1, 2, 3])
    let [arr2, setArr2] = useQueryParam('arr2', ['a', 'b', 'c'])
    let [arr3, setArr3] = useQueryParam('arr3', [['a', 1], ['b', 2], ['c', 3]])
    let [arr4, setArr4] = useQueryParam('arr4', [{ a: 1 }, { b: 2 }, { c: 3 }])
    let [obj, setObj] = useQueryParam('obj', { a: 1, b: 2, c: 3, foo: 'bar' })
    let [date, setDate] = useQueryParam('date', new Date('2019-11-17'))

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


  await frame(2)
  clearSearch()
  t.end()
})

t('useQueryParam: custom toString method')

!isNode && t('useQueryParam: observe updates', async t => {
  clearSearch()
  let log = []
  let f = enhook(() => {
    let [v, setV] = useQueryParam('x', 1)
    log.push(v)
    setV(2)
  })
  f()
  await frame(2)
  t.deepEqual(log, [1, 2])

  window.history.pushState(null, "useQueryParam", "?x=3");
  window.history.pushState(null, "useQueryParam", "?x=4");
  window.history.back()

  // FIXME: in some reason it waits 20 frames - for all prev tests or something
  await frame(40)
  t.deepEqual(log, [1, 2, 3, 2])

  await frame(2)
  clearSearch()
  t.end()
})

function clearSearch () {
  window.history.pushState(null, '', window.location.href.split('?')[0])
}
