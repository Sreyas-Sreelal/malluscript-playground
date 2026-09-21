import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0c0a09', // Deep obsidian ink black
      paper: '#181412',   // Rich roasted espresso brown
    },
    primary: {
      main: '#c87a3e',    // Warm caramel / copper amber
      light: '#dd9257',
      dark: '#a85f2a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5efe6',    // Warm bone / parchment white
      light: '#ffffff',
      dark: '#ded5c7',
      contrastText: '#0c0a09',
    },
    text: {
      primary: '#fcfbf9',   // Crisp paper white
      secondary: '#a89b8c', // Muted warm taupe
    },
    divider: '#2e2520',     // Dark warm umber rule
    error: {
      main: '#e05244',
      light: '#eb776b',
      dark: '#b83b2f',
    },
    warning: {
      main: '#d98240',
      light: '#e59a60',
      dark: '#b56426',
    },
    info: {
      main: '#c48b52',
    },
    success: {
      main: '#66aa70',
      light: '#7fc489',
      dark: '#4f8c58',
    },
  },
  typography: {
    fontFamily: [
      'Space Grotesk',
      'Anek Malayalam',
      'Manjari',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: '#fcfbf9',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#fcfbf9',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#fcfbf9',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 4, // Sharp, tactile letterpress corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0c0a09',
          color: '#fcfbf9',
          colorScheme: 'dark',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#181412',
          borderColor: '#2e2520',
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '6px 14px',
          boxShadow: '0 2px 0 #000000',
          transition: 'all 0.12s ease-in-out',
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#c87a3e',
          color: '#ffffff',
          border: '1px solid #e08e4f',
          boxShadow: '0 2px 0 #733c14',
          '&:hover': {
            backgroundColor: '#b86b32',
            boxShadow: '0 2px 0 #572d0e',
          },
        },
        outlined: {
          borderColor: '#382f28',
          color: '#f5efe6',
          backgroundColor: '#181412',
          '&:hover': {
            backgroundColor: '#241e1a',
            borderColor: '#c87a3e',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#100d0c',
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2e2520',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#544439',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c87a3e',
          },
        },
        input: {
          color: '#fcfbf9',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          backgroundColor: '#221b17',
          borderColor: '#382e27',
          color: '#f5efe6',
          boxShadow: '0 1px 0 #000000',
          '&:hover': {
            backgroundColor: '#2e251f',
            borderColor: '#c87a3e',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#100d0c',
          border: '1px solid #3d322a',
          color: '#fcfbf9',
          fontSize: '0.75rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
          borderRadius: 4,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#181412',
          border: '1px solid #382f28',
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.85)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#eae2d9',
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: '#241e1a',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(200, 122, 62, 0.2)',
            color: '#dd9257',
            '&:hover': {
              backgroundColor: 'rgba(200, 122, 62, 0.3)',
            },
          },
        },
      },
    },
  },
});

export default theme;
