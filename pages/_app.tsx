import type { AppProps } from 'next/app';
import Nav from '../components/Nav';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import GlobalStyle from '../components/globalstyles';

const theme: DefaultTheme = {
  colors: {
    primary: '#111',
    secondary: '#0070f3',
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Nav />
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
