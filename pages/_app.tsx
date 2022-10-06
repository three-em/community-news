import Nav from '../components/Nav';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { CurrentUserProvider } from '../reducers/userContext';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'NotoSansMono';
    src: url('../assets/fonts/NotoSansMono.ttf') format('truetype');
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace;
  }

  
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <CurrentUserProvider>
        <Nav />
        <Component {...pageProps} />
      </CurrentUserProvider>
    </>
  );
}

export default MyApp;
