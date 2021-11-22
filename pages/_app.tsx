import { AppProps } from "next/app";
import "./styles.css";
import { ThemeProvider, createTheme} from '@material-ui/core';
import  { Provider }  from "next-auth/client"

const App = ({ Component, pageProps:{session, ...pageProps} }: AppProps) => {
 
  const theme = createTheme({
    palette:{
      mode:'dark',
      primary:{
        main: '#FFFFFF'
      },
      secondary:{
        main: '#7E5095'
      }
    }
  });
  
  return (
    <Provider options={{clientMaxAge: 0,keepAlive: 0}} session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
