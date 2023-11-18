import { ColorSchemeScript } from '@mantine/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  /**
   * Renders the HTML document with metadata for the AI Cutout generator site.
   * @returns The HTML document with metadata.
   */
  render() {
    return (
      <Html>
        <Head>
          <ColorSchemeScript />
          <link rel="shortcut icon" href="/logo.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
