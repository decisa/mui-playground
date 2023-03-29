import { createContext, useRef, useMemo, useCallback } from 'react'
import magentoAuthorize from './magentoAuthorize'

type TMagentoContext = {
  token: React.MutableRefObject<string>
  getNewToken: () => Promise<string>
}

const MagentoContext = createContext<TMagentoContext>({
  token: { current: 'default TOKEN' },
  // eslint-disable-next-line @typescript-eslint/require-await
  getNewToken: async () => 'no context',
})

type MagentoProviderProps = {
  children: React.ReactNode
}
const MagentoProvider = ({ children }: MagentoProviderProps) => {
  console.log('PROVIDER RUNNING')
  const fetchToken = magentoAuthorize()

  const tokenRef = useRef('')

  const getNewToken = useCallback(async () => {
    const newToken = await fetchToken()
    tokenRef.current = newToken
    return newToken
  }, [fetchToken])

  // useEffect(() => {
  //   console.log('!!! initializing token now !!!')
  //   if (tokenRef.current === 'empty') {
  //     const initToken = async () => {
  //       const t = await getNewToken()
  //       tokenRef.current = t
  //     }
  //     initToken()
  //   }
  // }, [getNewToken])

  const context = useMemo(
    () => ({
      getNewToken,
      token: tokenRef,
    }),
    [getNewToken]
  )
  return (
    <MagentoContext.Provider value={context}>
      {children}
    </MagentoContext.Provider>
  )
}

export { MagentoContext, MagentoProvider }
