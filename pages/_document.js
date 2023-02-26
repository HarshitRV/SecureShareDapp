import { NavBar } from '@/components/Nav/NavBar'
import { Html, Head, Main, NextScript } from 'next/document'
import Image from "next/legacy/image";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
      <div style={{
        zIndex: -1,
        position: "fixed",
        width: "100vw",
        height: "100vh",
        opacity: 0.50
       
      }}>
      <Image src="/bg2.jpg" alt="cat Background" layout="fill" objectFit='cover' />
      </div>
        {/* <nav>
          <NavBar />
        </nav> */}
        <div className="mainNext">
        <Main />
        <NextScript />
        </div>
      </body>
    </Html>
  )
}
