import { createContext, useRef, useMemo, useCallback, useContext } from 'react'
import { ResultAsync, okAsync } from 'neverthrow'
import { differenceInMinutes } from 'date-fns'
import magentoAuthorizeNeverthrow from './magentoAuthorize'

export type TMagentoContextNeverthrow = {
  getToken: () => string
  renewToken: () => ResultAsync<string, Error>
}

const MagentoNeverThrowContext = createContext<TMagentoContextNeverthrow>({
  getToken: () => 'default token',
  // eslint-disable-next-line @typescript-eslint/require-await
  renewToken: () => okAsync('test'),
})

type MagentoProviderProps = {
  children: React.ReactNode
  tokenExpiration?: number
}

const TOKEN_EXPIRATION = 4 * 60 // 4 hours default Magento setting.

const MagentoProviderNeverthrow = ({
  children,
  tokenExpiration,
}: MagentoProviderProps) => {
  const expirationInMinutes = tokenExpiration || TOKEN_EXPIRATION
  const fetchToken = magentoAuthorizeNeverthrow()

  const tokenRef = useRef('')
  const dateRef = useRef(new Date())

  const renewToken = useCallback(() => {
    const newToken = fetchToken().andThen((token) => {
      tokenRef.current = `${token}`
      dateRef.current = new Date()
      return okAsync(token)
    })
    return newToken
  }, [fetchToken])

  const context = useMemo(
    () => ({
      renewToken,
      getToken: () => {
        // if ()
        const hrsSinceLastToken = differenceInMinutes(
          new Date(),
          dateRef.current
        )
        if (hrsSinceLastToken < expirationInMinutes) {
          return tokenRef.current
        }
        // console.log('token expired')
        return ''
      },
    }),
    [renewToken, expirationInMinutes]
  )
  return (
    <MagentoNeverThrowContext.Provider value={context}>
      {children}
    </MagentoNeverThrowContext.Provider>
  )
}

// const useMagentoContext = (): TMagentoContext => useContext(MagentoContext)
const useMagentoNeverthrowContext = (): TMagentoContextNeverthrow =>
  useContext(MagentoNeverThrowContext)

export {
  // useMagentoContext,
  useMagentoNeverthrowContext,
  // MagentoProvider,
  MagentoProviderNeverthrow,
}
