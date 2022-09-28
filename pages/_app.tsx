import Nav from '../components/Nav';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { CurrentUserProvider } from '../reducers/userContext';

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
      <CurrentUserProvider>
        <Nav />
        <Component {...pageProps} />
      </CurrentUserProvider>
    </>
  );
}

export default MyApp;
