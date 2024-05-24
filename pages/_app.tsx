import '../styles/globals.scss';
import '../styles/external/xterm.css';

import type { AppProps } from 'next/app';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/@ungap/custom-elements-builtin"></Script>
      <Script type="module" src="https://unpkg.com/x-frame-bypass"></Script>
    </>
  );
}

export default MyApp;
