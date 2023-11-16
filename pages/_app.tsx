import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AI Cutout generator</title>
        <meta name="description" content="A simple AI cutout generator" />
        <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 
export default MyApp
