import { createTheme, ThemeOptions } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import { createContext, useMemo, useState } from 'react'
import type {} from '@mui/x-data-grid/themeAugmentation'
import { LinkProps } from '@mui/material/Link'
import LinkBehavior from './Components/LinkBehavior'

export type ColorPalette = ReturnType<typeof tokens>

declare module '@mui/material/styles' {
  interface Palette {
    neutral: SimplePaletteColorOptions
  }
  interface PaletteColor {
    lightest?: string
  }
  interface SimplePaletteColorOptions {
    lightest?: string
  }
}

// color design tokens
export const tokens = (mode: string) => ({
  ...(mode === 'dark'
    ? {
        grey: {
          100: '#141414',
          200: '#292929',
          300: '#3d3d3d',
          400: '#525252',
          500: '#666666',
          600: '#858585',
          700: '#a3a3a3',
          800: '#c2c2c2',
          900: '#efefef',
        },
        primary: {
          100: '#E6EDFF',
          200: '#C9D5F2',
          300: '#B5C3E6',
          400: '#8496C2',
          500: '#6879A1',
          600: '#576C9C',
          700: '#31436E',
          800: '#212D4A',
          900: '#101624',
          // 100: '#d0d1d5',
          // 200: '#a1a4ab',
          // 300: '#727681',
          // 400: '#434957',
          // 500: '#141b2d',
          // 600: '#101624',
          // 700: '#0c101b',
          // 800: '#080b12',
          // 900: '#040509',
        },
        background: {
          50: '#384158',
          100: '#0b0e14',
          200: '#141b2d',
          300: '#1b2336',
          400: '#262f44',
          500: '#384158',
          600: '#58627b',
          700: '#8891aa',
          800: '#aeb5c8',
          900: '#d2d6e1',
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
          50: '#2a374c',
          100: '#1e2735',
          200: '#2a374c',
          300: '#3d5072',
          400: '#536e9b',
          500: '#6d8bbe',
          600: '#8aa5d3',
          700: '#abc0e2',
          800: '#ccd8ec',
          900: '#e1e8f3',
        },
        // blueAccent: {
        //   100: '#e2e8f2',
        //   200: '#c4d0e5',
        //   300: '#a7b9d7',
        //   400: '#89a1ca',
        //   500: '#6c8abd',
        //   600: '#566e97',
        //   700: '#415371',
        //   800: '#2b374c',
        //   900: '#161c26',
        // },
      }
    : {
        grey: {
          100: '#fafafa',
          200: '#eeeeee',
          300: '#a3a3a3',
          400: '#858585',
          500: '#666666',
          600: '#525252',
          700: '#3d3d3d',
          800: '#292929',
          900: '#141414',
        },
        primary: {
          100: '#101624',
          200: '#212D4A',
          300: '#31436E',
          400: '#576C9C',
          500: '#6879A1',
          600: '#8496C2',
          700: '#B5C3E6',
          800: '#C9D5F2',
          900: '#E6EDFF',
          // 100: '#040509',
          // 200: '#080b12',
          // 300: '#0c101b',
          // 400: '#101624', // f2f0f0
          // 500: '#141b2d',
          // 600: '#434957',
          // 700: '#727681',
          // 800: '#a1a4ab',
          // 900: '#d0d1d5',
        },
        background: {
          50: '#f3f4f7',
          100: '#d2d6e1',
          200: '#aeb5c8',
          300: '#8891aa',
          400: '#58627b',
          500: '#384158',
          600: '#262f44',
          700: '#1b2336',
          800: '#141b2d',
          900: '#0b0e14',
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
          50: '#f3f8ff',
          100: '#e1e8f3',
          200: '#ccd8ec',
          300: '#abc0e2',
          400: '#8aa5d3',
          500: '#6d8bbe',
          600: '#536e9b',
          700: '#3d5072',
          800: '#2a374c',
          900: '#1e2735',
        },
        // blueAccent: {
        //   100: '#161c26',
        //   200: '#ccd8ec',
        //   300: '#415371',
        //   400: '#566e97',
        //   500: '#6c8abd',
        //   600: '#89a1ca',
        //   700: '#a7b9d7',
        //   800: '#c4d0e5',
        //   900: '#e2e8f2',
        // },
      }),
})

// mui theme settings

export const themeSettings = (mode: PaletteMode): ThemeOptions => {
  const colors = tokens(mode)
  const options: ThemeOptions = {
    components: {
      // MuiButton: {
      //   styleOverrides: {
      //     contained: {
      //       color: '#fff',
      //       backgroundColor: colors.blueAccent[500],
      //       '&:hover': {
      //         color: '#fff',
      //         backgroundColor: colors.blueAccent[600],
      //       },
      //     },
      //     outlined: {
      //       color: colors.blueAccent[600],
      //       borderColor: colors.blueAccent[600],
      //       backgroundColor: `${colors.blueAccent[500]}11`,
      //       '&:hover': {
      //         color: '#fff',
      //         backgroundColor: colors.blueAccent[500],
      //       },
      //     },
      //   },
      // },
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
        styleOverrides: {
          root: {
            color: colors.blueAccent[500],
            '&:hover': {
              color: colors.blueAccent[600],
            },
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: 12,
            lineHeight: '20px',
            height: '20px',
            borderRadius: '4px',
          },
        },
      },
      // MuiDataGrid: {
      //   styleOverrides: {
      //     cell: {
      //       padding: '0 16px',
      //       backgroundColor: 'transparent',
      //     },
      //     root: {
      //       // backgroundColor: mode === 'dark' ? colors.background[300] : '#fff',
      //       height: '100%',
      //       gap: 0,
      //     },
      //     columnHeaders: {
      //       backgroundColor: colors.blueAccent[200],
      //     },
      //     footerContainer: {
      //       backgroundColor: colors.blueAccent[200],
      //     },
      //     editInputCell: {
      //       backgroundColor: 'transparent',
      //     },
      //   },
      // },
    },
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            // primary: {
            //   main: colors.primary[500],
            // },
            primary: {
              main: colors.blueAccent[500],
              light: colors.blueAccent[400],
              lightest: colors.blueAccent[200],
              dark: colors.blueAccent[700],
              contrastText: colors.grey[900],
            },
            secondary: {
              light: colors.greenAccent[400],
              main: colors.greenAccent[300],
            },
            neutral: {
              dark: colors.primary[300],
              main: colors.primary[500],
              light: colors.primary[800],
              lightest: colors.primary[900],
            },
            background: {
              default: colors.background[200],
              paper: colors.background[300],
            },
            text: {
              primary: `${colors.grey[900]}ff`,
              secondary: `${colors.grey[900]}bb`,
              disabled: `${colors.grey[700]}77`,
            },
          }
        : {
            // primary: {
            //   main: colors.primary[100],
            // },
            primary: {
              main: colors.blueAccent[500],
              light: colors.blueAccent[300],
              lightest: colors.blueAccent[200],
              dark: colors.blueAccent[600],
              contrastText: colors.grey[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[200],
              lightest: colors.grey[100],
            },
            background: {
              // default: '#fcfcfc',
              default: colors.background[50],
              paper: '#ffffff',
            },
            text: {
              primary: `${colors.grey[800]}ff`,
              secondary: `${colors.grey[800]}aa`,
              disabled: `${colors.grey[700]}55`,
            },
          }),
    },
    typography: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      htmlFontSize: 16,
      fontSize: 12,
      h1: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 40,
        fontSize: '2.5rem',
      },
      h2: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 32,
        fontSize: '2rem',
      },
      h3: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontSize: '1.5rem',
      },
      h4: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 20,
        fontSize: '1.25rem',
      },
      h5: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 16,
        fontSize: '1rem',
        fontWeight: 500,
      },
      h6: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 14,
        fontSize: '0.875rem',
        fontWeight: 700,
      },
      body1: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 16,
        fontSize: '1rem',
        fontWeight: 300,
      },
      body2: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 14,
        fontSize: '0.875rem',
        fontWeight: 300,
      },
      button: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        fontWeight: 400,
        // fontSize: 16,
        fontSize: '1rem',
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
