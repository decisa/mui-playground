import { createContext, useRef, useMemo, useCallback, useContext } from 'react'
import { ResultAsync, okAsync } from 'neverthrow'
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
}

const MagentoProviderNeverthrow = ({ children }: MagentoProviderProps) => {
  const fetchToken = magentoAuthorizeNeverthrow()

  const tokenRef = useRef('')

  const renewToken = useCallback(() => {
    const newToken = fetchToken().andThen((token) => {
      tokenRef.current = `${token}`
      return okAsync(token)
    })
    return newToken
  }, [fetchToken])

  const context = useMemo(
    () => ({
      renewToken,
      getToken: () => tokenRef.current,
    }),
    [renewToken]
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
