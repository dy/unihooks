import enhook from 'enhook'
import setHooks from 'any-hooks'

import * as preact from 'preact'
import * as hooks from 'preact/hooks'
enhook.use(preact)
setHooks(hooks)

// import * as atomico from 'atomico'
// enhook.use(atomico)
// setHooks(atomico)


export default enhook
