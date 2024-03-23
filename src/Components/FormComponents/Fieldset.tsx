import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`
// ${props => tokens(props.theme.palette.mode).primary[100]} 0%,
const FieldsetControl = styled.fieldset`
  border: 0;
  padding: 0;

  &[disabled] {
    opacity: 0.5;
  }
  &::before {
    height: 5px;
    content: '';
    display: block;
    position: relative;
    top: -8px;
    background-image: linear-gradient(
      to right,
      #6c8abd 0%,
      #4e6b98 50%,
      #6c8abd 100%
    );
  }
  &[aria-busy='true']::before {
    background-size: 50% auto;
    animation: ${loading} 0.5s linear infinite;
  }
  &[aria-busy='false']::before {
    background-image: none;
  }
`
type FieldsetProps = {
  children: React.ReactNode
  disabled?: boolean
  'aria-busy'?: boolean
}

export default function Fieldset({ children, ...props }: FieldsetProps) {
  // use mui theme
  const theme = useTheme()
  // const colors = tokens(theme.palette.mode)
  return (
    <FieldsetControl theme={theme} {...props}>
      {children}
    </FieldsetControl>
  )
}
