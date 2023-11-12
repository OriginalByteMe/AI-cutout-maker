import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';
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
          <title>AI Cutout generator</title>
          <meta name="description" content="A simple AI cutout generator" />
          <link rel="shortcut icon" href="/logo.svg" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
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