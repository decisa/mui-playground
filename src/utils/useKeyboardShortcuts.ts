import { useCallback, useEffect } from 'react'

type UseKeyboardShortcutsProps = {
  onEnter?: (e: KeyboardEvent) => void
  onEsc?: (e: KeyboardEvent) => void
  onCtrlSpace?: (e: KeyboardEvent) => void
  debugSource?: string
}
export default function useKeyboardShortcuts({
  onEnter,
  onEsc,
  onCtrlSpace,
  debugSource,
}: UseKeyboardShortcutsProps) {
  // console.log('use keyboard called')
  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Enter':
          if (typeof onEnter === 'function') {
            onEnter(e)
          }
          // console.log('key pressed: ', e.code)
          break
        case 'Escape':
          if (typeof onEsc === 'function') {
            onEsc(e)
          }
          // console.log('key pressed: ', e.code)
          break
        case 'Space':
          if (e.ctrlKey && typeof onCtrlSpace === 'function') {
            onCtrlSpace(e)
          }
          break
        default:
      }
      // console.log('key pressed: ', e.code, e.key)
    },
    // []
    [onEnter, onEsc, onCtrlSpace]
  )

  useEffect(() => {
    // add keyboard listener
    document.addEventListener('keydown', handleKeyboard)
    if (debugSource) {
      console.log(`added listener! ${debugSource}`)
    }

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyboard)
      if (debugSource) {
        console.log(`removed listener! ${debugSource}`)
      }
    }
  }, [handleKeyboard, debugSource])
}
