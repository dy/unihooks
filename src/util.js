
// patch history method to emit event https://stackoverflow.com/a/25673946/1052640
// or https://github.com/lukeed/navaid/blob/master/src/index.js#L80-L90
export function wrapHistory(type) {
  if (history[type]) return
  history[type] = type
  let fn = history[type += 'State']
  history[type] = function (uri) {
    let result = fn.apply(this, arguments)
    let ev = new Event(type.toLowerCase())
    ev.uri = uri
    ev.arguments = arguments
    window.dispatchEvent(ev)
    return result
  }
}

let navigateEventEnabled = false
export function navigateEvent() {
  if (navigateEventEnabled) return
  navigateEventEnabled = true

  // excerpt from https://github.com/WebReflection/onpushstate
  // or https://github.com/lukeed/navaid/blob/master/src/index.js#L52-L60
  document.addEventListener('click', function (e) {
    // find the link node (even if inside an opened Shadow DOM)
    var target = e.target.shadowRoot ? e.path[0] : e.target;
    // find the anchor
    var anchor = target.closest('A')

    // if found
    if (!anchor) return

    // it's not a click with ctrl/shift/alt keys pressed
    // => (let the browser do it's job instead)
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.button && !e.defaultPrevented) return

    // it's for the current page
    if (!/^(?:_self)?$/i.test(anchor.target)) return

    // same origin
    if (anchor.host !== location.host) return

    // it's not a download
    if (anchor.hasAttribute('download')) return

    // it's not a resource handled externally
    if (anchor.getAttribute('rel') === 'external') return

    // let empty links be (see issue #5)
    if (!anchor.href) return

    var e = new Event('navigate');
    window.dispatchEvent(e);

  }, true);
}
