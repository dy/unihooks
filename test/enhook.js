import enhook from 'enhook'
import * as preact from 'preact'
import * as hooks from 'preact/hooks'
import setHooks from 'any-hooks'

enhook.use(preact)
setHooks(hooks)

export default enhook
