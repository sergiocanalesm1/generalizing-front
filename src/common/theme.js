import { createTheme } from "@mui/material";


const theme = createTheme({
    typography : {
      fontFamily : 'HomepageBaukasten, Arial',
      fontWeight : 200,
  
      h1 : {
        fontSize   : '1.8em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      h2 : {
        fontSize   : '1.6em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      h3 : {
        fontSize   : '1.4em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      h4 : {
        fontSize   : '1.2em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      h5 : {
        fontSize   : '1.1em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      h6 : {
        fontSize   : '1em',
        fontFamily : 'gilroy, Arial',
        fontWeight : 700
      },
      body : {
        fontSize : '1em',
      },
      small : {
        fontSize : '0.75em'
      },
      large : {
        fontSize : '3em'
      },
    },
    palette : {
      primary: {
        main: '#00B7EB' //CYAN
      },
      secondary:{
        main: '#FFFFFF'
      }
    },
    background : {
      
    },
  });

  export default theme;