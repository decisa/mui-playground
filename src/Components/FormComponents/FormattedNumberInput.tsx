import { TextFieldProps } from '@mui/material'
import { useEffect } from 'react'

type FormattedNumberInputProps = {
  // type: 'currency' | 'number'
  value?: unknown
} & Omit<TextFieldProps, 'type' | 'value'> // & { onChange: (value: number) => void }

export default function FormattedNumberInput({
  value,
  ...rest
}: FormattedNumberInputProps) {
  console.log('FormattedNumberInput:', value, rest)
  useEffect(() => {
    if (value) {
      console.log('value:', value)
    }
  }, [value])
  return (
    <div>
      <h1>FormattedNumberInput</h1>
    </div>
  )
}

export function test() {
  document.addEventListener('mouseover', (event) => {
    // const element = event.target
    const { altKey, ctrlKey, shiftKey } = event
    if (altKey && ctrlKey && shiftKey) {
      console.log('ctrl+alt+shift clicked !')
    }
  })
}
