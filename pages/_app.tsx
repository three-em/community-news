// import '../styles/globals.css';
import Nav from '../components/Nav';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
