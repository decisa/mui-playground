import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import * as React from 'react'

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const pinStyle = {
  fill: '#d00',
  stroke: 'none',
}

// const markerSizes = ['small', 'medium', 'large']
const markerSizes = ['large']
export type MarkerSize = (typeof markerSizes)[number]

type MarkerStyles = {
  circle: SxProps
  label: SxProps
}

const largeSize = '33px'
const markerStyle: { [key in MarkerSize]: MarkerStyles } = {
  large: {
    circle: {
      width: largeSize,
      minWidth: largeSize,
      maxWidth: largeSize,
      height: largeSize,
      minHeight: largeSize,
      maxHeight: largeSize,
      borderRadius: '50%',
      border: '2px solid #fff',
      textAlign: 'center',
      fontSize: '1rem',
      lineHeight: '30px',
      fontWeight: 'bold',
    },
    label: {
      fontSize: '1rem',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 1,
      maxWidth: '140px',
    },
  },
}

function Pin(props: {
  size: MarkerSize
  label: string
  number: number
  color?: string
}) {
  const { size, label, number, color } = props

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          ...markerStyle[size].circle,
          backgroundColor: color,
          boxShadow: `0 0 0 2px ${color || '#777777'}77`,
          color: '#fff',
        }}
      >
        {number}
      </Box>
      <Typography
        align="center"
        sx={{
          ...markerStyle[size].label,
          color,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
  // return (
  //   <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
  //     <path d={ICON} />
  //   </svg>
  // )
}

export default React.memo(Pin)
// export default Pin
