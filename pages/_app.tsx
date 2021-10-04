import { AppProps } from "next/app";
import "./styles.css";
import { ThemeProvider, createTheme} from '@material-ui/core';

const App = ({ Component, pageProps }: AppProps) => {

  const theme = createTheme({
    palette:{
      mode:'dark',
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
