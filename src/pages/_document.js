import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
// import { ServerStyleSheets } from '@material-ui/styles'
import {Html} from "next/document";
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components'
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/core/styles';

class _Document extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

_Document.getInitialProps = async ctx => {
  // const sheets = new ServerStyleSheets()
  // const originalRenderPage = ctx.renderPage

  // ctx.renderPage = () => originalRenderPage({
  //   enhanceApp: WrappedComponent => props => sheets.collect(<WrappedComponent {...props} />)
  // })

  // const initialProps = await Document.getInitialProps(ctx)

  // return {
  //   ...initialProps,
  //   styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]
  // }
  const styledComponentSheet = new StyledComponentSheets()
   const materialUiSheets = new MaterialUiServerStyleSheets()
   const originalRenderPage = ctx.renderPage

  try {
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        styledComponentSheet.collectStyles(
          materialUiSheets.collect(<App {...props} />),
        ),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {materialUiSheets.getStyleElement()}
        {styledComponentSheet.getStyleElement()}
      </React.Fragment>,
    ],
    }
   } finally {
     styledComponentSheet.seal()
   }
}

export default _Document
