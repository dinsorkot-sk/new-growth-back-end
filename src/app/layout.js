import "./globals.css";
import { Inter, Prompt } from 'next/font/google';
import 'sweetalert2/dist/sweetalert2.min.css'
import ClientNavLoader from '../components/ClientNavLoader'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const prompt = Prompt({
  weight: ['100', '300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-prompt',
});

export const metadata = {
  title: "ระบบจัดการหลังบ้าน",
  description: "ระบบจัดการหลังบ้าน",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${prompt.variable}`}>
        <Script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js" strategy="beforeInteractive" />
        <ClientNavLoader />
        {children}
      </body>
    </html>
  );
}
