// eslint-disable-next-line import/no-extraneous-dependencies
import { SxProps } from '@mui/system'

type MainNavBarStyles = {
  drawer: SxProps
  items: SxProps
  text: SxProps
}

export const mainNavBarStyles: MainNavBarStyles = {
  drawer: {
    // width: 280,
    // flexShrink: 0,
    // '& .MuiDrawer-paper': {
    //   width: 280,
    //   bgcolor: '#101F33',
    //   color: 'rgba(255, 255, 255, 0.7)',
    // },
    // '& .Mui-selected': {
    //   color: 'red',
    // },
  },
  items: {
    // color: 'rgba(255, 255, 255, 0.7)',
    // ml: 1,
  },
  text: {
    // '& span': {
    //   ml: -1,
    //   fontWeight: 500,
    //   fontSize: 16,
    //   color: '#fff',
    //   '&:hover': {
    //     color: '#c5d8fd',
    //   },
    // },
  },
}
