import { createContext, useRef, useMemo, useCallback, useContext } from 'react'
import magentoAuthorize from './magentoAuthorize'

export type TMagentoContext = {
  getToken: () => string
  renewToken: () => Promise<string>
}

const MagentoContext = createContext<TMagentoContext>({
  getToken: () => 'default token',
  // eslint-disable-next-line @typescript-eslint/require-await
  renewToken: async () => 'no context',
})

type MagentoProviderProps = {
  children: React.ReactNode
}

const MagentoProvider = ({ children }: MagentoProviderProps) => {
  console.log('PROVIDER RUNNING')
  const fetchToken = magentoAuthorize()

  const tokenRef = useRef('')

  const renewToken = useCallback(async () => {
    const newToken = await fetchToken()
    tokenRef.current = newToken
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
    <MagentoContext.Provider value={context}>
      {children}
    </MagentoContext.Provider>
  )
}

const useMagentoContext = (): TMagentoContext => useContext(MagentoContext)

export { useMagentoContext, MagentoProvider }
