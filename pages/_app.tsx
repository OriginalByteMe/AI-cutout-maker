import '@mantine/core/styles.css';
import { AppProps } from 'next/app';
import '../styles/global.css';
import Head from 'next/head';
import Layout from '@/layouts/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>AI Cutout generator</title>
        <meta name="description" content="A simple AI cutout generator" />
        <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}
 
export default MyApp
