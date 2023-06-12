import { ResultAsync, err } from 'neverthrow'

import { MagentoError } from './MagentoError'
import { toErrorWithMessage } from '../utils/errorHandling'
import { reportNetworkError } from './useMagentoAPI'

const usr = process.env.REACT_APP_MAGENTO_USER || ''
const pass = process.env.REACT_APP_MAGENTO_PASS || ''
export const domain =
  process.env.REACT_APP_MAGENTO_DOMAIN || 'https://www.roomservice360.com'
export const apiPath = `${domain}/rest/default`

console.log('domain', domain)
console.log('apiPath', apiPath)
console.log('usr', usr)
console.log('pass', pass)
// *************** URLS ***************
function getTokenUrl(user = '', password = '') {
  return `${apiPath}/V1/integration/admin/token/?username=${`${user}`}&password=${password}`
}

// TODO: erase token on error

const magentoAuthorizeNeverthrow = (
  user: string = usr,
  password: string = pass
) => {
  // ResultAsync<string, Error>
  function getNewToken() {
    return ResultAsync.fromPromise(
      fetch(getTokenUrl(user, password), {
        method: 'POST',
      }),
      // (error) => toErrorWithMessage(error)
      reportNetworkError
    ).andThen((result) => {
      if (!result.ok) {
        switch (result.status) {
          case 400: {
            return err(MagentoError.badData(new Error(result.statusText)))
          }
          case 401: {
            return err(MagentoError.unauthorized(new Error(result.statusText)))
          }
          case 404: {
            return err(MagentoError.notFound(new Error(result.statusText)))
          }
          default:
            return err(
              new Error(
                `unknown status code: ${result.status}${result.statusText}`
              )
            )
        }
      }

      return ResultAsync.fromPromise(
        result.json() as Promise<string>,
        (error) => MagentoError.unknown(toErrorWithMessage(error))
      )
    })
  }

  return getNewToken
}

export default magentoAuthorizeNeverthrow
