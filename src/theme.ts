import {
  alpha,
  createTheme,
  PaletteOptions,
  ThemeOptions,
} from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import { createContext, useMemo, useState } from 'react'
import type {} from '@mui/x-data-grid/themeAugmentation'
import { LinkProps } from '@mui/material/Link'
import { purple, teal, yellow } from '@mui/material/colors'
import LinkBehavior from './Components/LinkBehavior'

export type ColorPalette = ReturnType<typeof tokens>

declare module '@mui/material/styles' {
  interface Palette {
    neutral: SimplePaletteColorOptions
  }
  interface PaletteOptions {
    neutral: SimplePaletteColorOptions
  }
  interface PaletteColor {
    lightest?: string
  }

  interface TypeBackground {
    menu?: string
    surface?: string
  }
  interface SimplePaletteColorOptions {
    lightest?: string
  }
}

type ColorShades = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type DesignColors = {
  grey: ColorShades
  primary: ColorShades
  background: ColorShades
  greenAccent: ColorShades
  redAccent: ColorShades
  blueAccent: ColorShades
  yellowAccent: ColorShades
}
// color design tokens
export const tokens = (mode: string): DesignColors => ({
  ...(mode === 'dark'
    ? {
        grey: {
          50: '#0F0F0F',
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
          50: 'EEF5FF',
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
          50: '#0f1728',
          100: '#162538',
          200: '#253955',
          300: '#344b6b',
          400: '#526c92',
          500: '#6a80a5',
          600: '#8296b8',
          700: '#a2b4d2',
          800: '#c1d3ed',
          900: '#e4ecff',
          // 50: '#384158',
          // 100: '#0b0e14',
          // 200: '#141b2d',
          // 300: '#1b2336',
          // 400: '#262f44',
          // 500: '#384158',
          // 600: '#58627b',
          // 700: '#8891aa',
          // 800: '#aeb5c8',
          // 900: '#d2d6e1',
        },
        greenAccent: {
          50: '#e3f9f3',
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
          50: '#ffe5e7',
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
        yellowAccent: {
          50: yellow[50],
          100: yellow[100],
          200: yellow[200],
          300: yellow[300],
          400: yellow[400],
          500: yellow[500],
          600: yellow[600],
          700: yellow[700],
          800: yellow[800],
          900: yellow[900],
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
          50: '#fcfcfc',
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
          50: '#0a101f',
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
          50: '#e4ecff',
          100: '#c1d3ed',
          200: '#a2b4d2',
          300: '#8296b8',
          400: '#6a80a5',
          500: '#526c92',
          600: '#344b6b',
          700: '#253955',
          800: '#162538',
          900: '#0f1728',
          // 50: '#f3f4f7',
          // 100: '#d2d6e1',
          // 200: '#aeb5c8',
          // 300: '#8891aa',
          // 400: '#58627b',
          // 500: '#384158',
          // 600: '#262f44',
          // 700: '#1b2336',
          // 800: '#141b2d',
          // 900: '#0b0e14',
        },
        greenAccent: {
          50: '#041b15',
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
          50: '#270102',
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
        yellowAccent: {
          50: yellow[50],
          100: yellow[100],
          200: yellow[200],
          300: yellow[300],
          400: yellow[400],
          500: yellow[500],
          600: yellow[600],
          700: yellow[700],
          800: yellow[800],
          900: yellow[900],
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
  const palette: PaletteOptions = {
    mode,
    action: {
      // active: alpha(colors.greenAccent[500], 1),
      // hover: alpha(colors.redAccent[500], 1),
      // hoverOpacity: 1,
      // selected: alpha(colors.redAccent[500], 1),
      // selectedOpacity: 1,
      // disabled: alpha(colors.redAccent[500], 1),
      // disabledBackground: alpha(colors.redAccent[500], 1),
      // disabledOpacity: 1,
      // focus: alpha(colors.redAccent[500], 1),
      // focusOpacity: 1,
      // activatedOpacity: 1,
    },
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
          // secondary: {
          //   light: colors.greenAccent[400],
          //   main: colors.greenAccent[300],
          // },
          neutral: {
            dark: colors.primary[300],
            main: colors.primary[500],
            light: colors.primary[800],
            lightest: colors.primary[900],
          },
          background: {
            default: colors.background[50],
            paper: colors.background[100],
          },
          text: {
            primary: `${colors.grey[900]}ff`,
            secondary: `${colors.grey[900]}bb`,
            disabled: `${colors.grey[700]}77`,
          },
          info: {
            main: colors.blueAccent[500],
          },
          warning: {
            main: colors.yellowAccent[100],
            contrastText: colors.grey[900],
            light: colors.yellowAccent[200],
            dark: colors.yellowAccent[500],
            lightest: colors.yellowAccent[100],
          },
          success: {
            main: teal[300],
            contrastText: colors.grey[900],
            light: teal[200],
            dark: teal[500],
            lightest: teal[100],
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
          // secondary: {
          //   main: colors.greenAccent[500],
          // },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[200],
            lightest: colors.grey[100],
          },
          background: {
            // default: '#fcfcfc',
            default: colors.grey[100],
            paper: '#ffffff',
          },
          text: {
            primary: `${colors.grey[800]}ff`,
            secondary: `${colors.grey[800]}aa`,
            disabled: `${colors.grey[700]}55`,
          },
          info: {
            main: colors.blueAccent[500],
          },
          warning: {
            main: colors.yellowAccent[200],
            contrastText: colors.grey[900],
            light: colors.yellowAccent[100],
            dark: colors.yellowAccent[400],
            lightest: colors.yellowAccent[50],
          },
          success: {
            main: teal[200],
            contrastText: colors.grey[900],
            light: teal[100],
            dark: teal[400],
            lightest: teal[50],
          },
          secondary: {
            main: purple[200],
            contrastText: colors.grey[900],
            light: purple[100],
            dark: purple[300],
            lightest: purple[50],
          },
        }),
  } as const

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
      MuiButton: {
        styleOverrides: {
          outlinedWarning:
            mode === 'dark'
              ? {
                  borderColor: colors.yellowAccent[500],
                  color: colors.yellowAccent[600],
                  ':hover': {
                    borderColor: colors.yellowAccent[400],
                    color: colors.yellowAccent[500],
                  },
                }
              : {
                  borderColor: colors.yellowAccent[700],
                  color: colors.yellowAccent[800],
                  ':hover': {
                    borderColor: colors.yellowAccent[800],
                    color: colors.yellowAccent[900],
                  },
                },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.color === 'primary' && {
              '&.Mui-selected': {
                // color: colors.redAccent[500],
                backgroundColor: colors.blueAccent[200],
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: colors.blueAccent[300],
                },
              },
            }),
          }),
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: 12,
            lineHeight: '21px',
            height: '20px',
            borderRadius: '4px',
          },
          colorWarning:
            mode === 'dark'
              ? {
                  borderColor: alpha(colors.yellowAccent[500], 0.7),
                  color: alpha(colors.yellowAccent[500], 0.9),
                }
              : {
                  borderColor: colors.yellowAccent[600],
                  color: colors.grey[900],
                },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: palette?.background?.paper,
            backgroundImage: 'none',
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            '&.Mui-selected': {
              backgroundColor: alpha(colors.blueAccent[500], 0.5),
              '& .MuiTypography-root': {
                fontWeight: 500,
              },
            },
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
    palette,
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
        lineHeight: 1.5,
      },
      body2: {
        FontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        // fontSize: 14,
        fontSize: '0.875rem',
        fontWeight: 300,
        lineHeight: 1.5,
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

export const useDarkTheme = () => {
  const darkTheme = useMemo(() => createTheme(themeSettings('dark')), [])
  return darkTheme
}
