import { createTheme, ThemeOptions } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
// import { ThemeOptions } from '@mui/system'
import { createContext, useMemo, useState } from 'react'
import { lineHeight } from '@mui/system'

// color design tokens
export const tokens = (mode: string) => ({
  ...(mode === 'dark'
    ? {
        grey: {
          100: '#fafafa',
          200: '#c2c2c2',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414',
        },
        primary: {
          100: '#d0d1d5',
          200: '#a1a4ab',
          300: '#727681',
          400: '#434957',
          500: '#141b2d',
          600: '#101624',
          700: '#0c101b',
          800: '#080b12',
          900: '#040509',
        },
        greenAccent: {
          100: '#dcf0eb',
          200: '#bae0d6',
          300: '#97d1c2',
          400: '#75c1ad',
          500: '#52b299',
          600: '#428e7a',
          700: '#316b5c',
          800: '#21473d',
          900: '#10241f',
        },
        redAccent: {
          100: '#f5d2d4',
          200: '#eba6a9',
          300: '#e1797d',
          400: '#d74d52',
          500: '#cd2027',
          600: '#a41a1f',
          700: '#7b1317',
          800: '#520d10',
          900: '#290608',
        },
        blueAccent: {
          100: '#e2e8f2',
          200: '#c4d0e5',
          300: '#a7b9d7',
          400: '#89a1ca',
          500: '#6c8abd',
          600: '#566e97',
          700: '#415371',
          800: '#2b374c',
          900: '#161c26',
        },
      }
    : {
        grey: {
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#e0e0e0',
        },
        primary: {
          100: '#040509',
          200: '#080b12',
          300: '#0c101b',
          400: '#101624', // f2f0f0
          500: '#141b2d',
          600: '#434957',
          700: '#727681',
          800: '#a1a4ab',
          900: '#d0d1d5',
        },
        greenAccent: {
          100: '#10241f',
          200: '#21473d',
          300: '#316b5c',
          400: '#428e7a',
          500: '#52b299',
          600: '#75c1ad',
          700: '#97d1c2',
          800: '#bae0d6',
          900: '#dcf0eb',
        },
        redAccent: {
          100: '#290608',
          200: '#520d10',
          300: '#7b1317',
          400: '#a41a1f',
          500: '#cd2027',
          600: '#d74d52',
          700: '#e1797d',
          800: '#eba6a9',
          900: '#f5d2d4',
        },
        blueAccent: {
          100: '#161c26',
          200: '#2b374c',
          300: '#415371',
          400: '#566e97',
          500: '#6c8abd',
          600: '#89a1ca',
          700: '#a7b9d7',
          800: '#c4d0e5',
          900: '#e2e8f2',
        },
      }),
})

// mui theme settings

export const themeSettings = (mode: PaletteMode): ThemeOptions => {
  const colors = tokens(mode)

  const options: ThemeOptions = {
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            color: '#fff',
            backgroundColor: colors.blueAccent[500],
            '&:hover': {
              color: '#fff',
              backgroundColor: colors.blueAccent[300],
            },
          },
        },
      },
    },
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
              paper: colors.primary[500],
            },
            text: {
              primary: `${colors.grey[100]}ff`,
              secondary: `${colors.grey[300]}dd`,
              disabled: `${colors.grey[300]}77`,
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: '#fcfcfc',
              paper: '#ffffff',
            },
            text: {
              primary: `${colors.grey[300]}ff`,
              secondary: `${colors.grey[300]}aa`,
              disabled: `${colors.grey[300]}55`,
            },
          }),
    },
    typography: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 14,
        fontWeight: 700,
      },
      body1: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 16,
        fontWeight: 400,
      },
      body2: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: 14,
        fontWeight: 400,
      },
      button: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 1.75,
        textTransform: 'lowercase',
      },
    },
  }

  return options
}

// context for color mode:
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export const useMode = () => {
  const [mode, setMode] = useState<PaletteMode>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    []
  )

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  return [theme, colorMode] as const
}
