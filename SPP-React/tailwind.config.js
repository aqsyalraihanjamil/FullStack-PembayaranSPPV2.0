module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: '',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'purple-base': '#423DDB',
        'purple-light': '#6058E2',
        'purple-verylight': '#EFEEFC',
        'tosca': '#24B1C5',
        'tosca-light': '#EAF7F9',
        'grey-666': '#666666',
        'grey-eee': '#EEEEEE',
        'yellow-dollar': '#FCA765',
        'red-base': '#D82F45',
        'black-logo': '#130F26',
        'grey-activities': '#595959'
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
      }, gridTemplateColumns: {
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
        '10%': '8.33333%',
        '5%': '5.55%',
        '12.5%': '12.5%',
        '25%': '25%',
        '30%': '30%',
        '15%': '15%',
      },
      width: {
        '76': '19rem',
        '1/7': '14.2857142857%',
        '1/8': '12.5%'
      },
      height: {
        '22': '5.5rem',
        '10%': '8.33333%',
        '1/7': '14.2857142857%',
        '90%': "91.677777%",
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
      },
      borderRadius: {
        'custom': '10px',
      },
      boxShadow: {
        'bottom': '15px 5px 30px 2px rgba(0, 0, 0, 0.25);',
      },
      opacity: {
        '15': '.15',
      },
      minWidth: {
        'normal': '500px',
        'card': '150px',

      },
      minHeight: {
        '400' : '400px'
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}
