import { AppProps } from "next/app";
import "./styles.css";
import {Button, ThemeProvider, createTheme} from '@material-ui/core';
import { orange } from "@material-ui/core/colors";

const App = ({ Component, pageProps }: AppProps) => {

  const theme = createTheme({
    palette:{
      primary:{
        main: '#6E4582'
      },
      secondary:{
        main: '#7E5095'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
