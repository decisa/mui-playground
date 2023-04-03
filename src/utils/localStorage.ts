import { useEffect, useRef, useState } from 'react'
import { isEmptyObject } from './utils'

type Serializer<T> = (stateObj: T) => string
type Deserializer<T> = (storageValue: string) => T

export default function useLocalStorageState<T>(
  initialValue: T | (() => T),
  key = 'custom',
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: { serialize?: Serializer<T>; deserialize?: Deserializer<T> } = {}
) {
  const [state, setState] = useState<T>(() => {
    const valueInStorage = window.localStorage.getItem(key)
    if (valueInStorage) {
      return deserialize(valueInStorage)
    }
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  })

  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
      prevKeyRef.current = key
    }
    if (!isEmptyObject(state)) {
      window.localStorage.setItem(key, serialize(state))
    } else {
      console.error(
        `"${key}" : !!! Requested to erase local storage - Erase prevention is in effect. Delete local storage manually if needed`
      )
      // const valueInStorage = window.localStorage.getItem(key)
      // if (!isEmptyObject(valueInStorage)) {
      //   setState(deserialize(valueInStorage))
      // }
    }
  }, [key, serialize, state, deserialize])

  return [state, setState] as const
}

// import React from 'react'
// import { isEmptyObject } from './utils'

// export default function useLocalStorageState<T>(
//   initialValue: T | (() => T),
//   key = 'custom',
//   {
//     serialize,
//     deserialize,
//   }: {
//     serialize: (stateObj: T) => string
//     deserialize: (storageValue: string) => T
//   } = { serialize: JSON.stringify, deserialize: JSON.parse }
// ) {
//   const [state, setState] = React.useState<T>(initialValue)
//   // const [isInitialized, setIsInitialized] = React.useState(false)

//   // don't need a re-render on initialization
//   const isInitialized = React.useRef(false)

//   // on load
//   React.useEffect(() => {
//     console.log('on load effect!')
//     const valueInStorage = window.localStorage.getItem(key)
//     let initState
//     if (valueInStorage) {
//       console.log(
//         'trying to get from storage',
//         valueInStorage,
//         typeof valueInStorage
//       )
//       initState = deserialize(valueInStorage)
//     } else if (typeof initialValue === 'function') {
//       initState = (initialValue as () => T)()
//     } else {
//       initState = initialValue
//     }
//     setState(initState)
//     isInitialized.current = true
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const prevKeyRef = React.useRef(key)

//   React.useEffect(() => {
//     console.log('on change effect!')
//     const prevKey = prevKeyRef.current
//     if (prevKey !== key) {
//       console.log(`the key has changed from "${prevKey}" to "${key}" `)
//       window.localStorage.removeItem(prevKey)
//     }
//     prevKeyRef.current = key
//     if (isInitialized.current) {
//       console.log('writing new state to local storage!', state, key, prevKey)
//       if (isEmptyObject(state)) {
//         console.error(
//           `"${key}" : !!! Requested to erase local storage - Erase prevention is in effect. Delete local storage manually if needed`
//         )
//         const valueInStorage = window.localStorage.getItem(key)

//         console.log('state:', state)
//         console.log('valueInStorage:', valueInStorage)

//         if (!isEmptyObject(valueInStorage)) {
//           return // do not erase local storage
//         }
//       }
//       window.localStorage.setItem(key, serialize(state))
//     }
//   }, [state, key, serialize])

//   return [state, setState]
// }
