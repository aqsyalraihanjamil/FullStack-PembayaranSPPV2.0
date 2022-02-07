module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: '',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'purple-base': '#423DDB',
        'purple-light': '#6058E2',
        'purple-verylight': '#EEEDFD',
        'tosca': '#24B1C5',
        'tosca-light': '#EAF7F9',
        'grey-666': '#666666',
        'grey-eee': '#EEEEEE',
        'yellow-dollar': '#FCA765',
        'red-base': '#D82F45',
        'black-logo': '#130F26',
      },
      gridTemplateRows: {
        // Simple 8 row grid
        '12': 'repeat(12, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',

        // Complex site-specific row configuration
        'layout': '200px minmax(900px, 1fr) 100px',
      },
      gridRowStart: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },gridTemplateColumns: {
        // Simple 16 column grid
        '13': 'repeat(13, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },
      gridRowEnd: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      fontFamily: {
        body: ['Poppins'],
        base: ['Montserrat']
      },
      spacing: {
        '18': '4.5rem',
        '76': '19rem',
        '22': '5.5rem',
        '10%': '8.33333%'
      },
      width: {
        '76': '19rem',
      },
      height: {
        '22': '5.5rem',
        '10%': '8.33333%'
      },
      borderRadius: {
        'custom': '10px',
      },
      boxShadow: {
        'bottom': '15px 5px 30px 2px rgba(0, 0, 0, 0.25);',
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}
