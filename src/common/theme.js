import { createTheme } from "@mui/material";


const theme = createTheme({
    typography : {
      fontFamily : 'HomepageBaukasten, Arial',
  
      h1 : {
        fontSize   : '1.8em',
        fontWeight : 700
      },
      h2 : {
        fontSize   : '1.6em',
        fontWeight : 700
      },
      h3 : {
        fontSize   : '1.4em',
        fontWeight : 700
      },
      h4 : {
        fontSize   : '1.2em',
        fontWeight : 700
      },
      h5 : {
        fontSize   : '1.1em',
        fontWeight : 700
      },
      h6 : {
        fontSize   : '1em',
        fontWeight : 700
      },
      body : {
        fontSize : '1em',
      },
      small : {
        fontSize : '0.75em',
        opacity : '0,5',
        color: 'gray'
      },
      large : {
        fontSize : '3em'
      },
    },
    palette : {
      primary: {
        main: '#00B7EB', //CYAN
        dark: '',
        light: '#A0CCDA',
        contrastText: '#FFF'
      },
      secondary:{
        //main: '#9CFFD9' //ACUAMARINE
        main: '#FFF'
      },
    },
    background : {
      
    },
  });

  export default theme;