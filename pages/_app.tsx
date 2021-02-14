import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import React from 'react'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <RecoilRoot>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Home Status Dashboard</title>
        <meta property="og:title" content="Home Status Dashboard" />
        <meta
          property="og:description"
          content="This is a web page where you can check the status of AWS. The official AWS Service Health Dashboard is difficult to use, so I recreated it using Next.js Vercel."
        />
        <meta name="keywords" content="AWS, status" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://aws-health-dashboard.vercel.app/"
        />
        <meta property="og:image" content="https://i.imgur.com/XblRysI.png" />
        <meta property="og:site_name" content="AWS Health Dashboard" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@meitante1conan" />
        <meta
          name="twitter:url"
          content="https://aws-health-dashboard.vercel.app/"
        />
        <meta name="twitter:title" content="AWS Health Dashboard" />
        <meta
          name="twitter:description"
          content="This is a web page where you can check the status of AWS."
        />
        <meta name="twitter:image" content="https://i.imgur.com/XblRysI.png" />
        <meta property="fb:app_id" content="280941406476272" />
        <link rel="canonical" href="https://aws-health-dashboard.vercel.app/" />
        <link rel="apple-touch-icon" href={'https://i.imgur.com/MFmxl0F.png'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </RecoilRoot>
  </>
)

export default App
