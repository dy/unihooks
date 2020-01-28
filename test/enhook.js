import enhook from 'enhook'
import setHooks from '../'

import * as preact from 'preact'
import * as hooks from 'preact/hooks'
enhook.use(preact)
setHooks(hooks)

// import * as atomico from 'atomico'
// enhook.use(atomico)
// setHooks(atomico)

// import * as aug from 'augmentor'
// enhook.use(aug)
// setHooks(aug)


export default enhook
