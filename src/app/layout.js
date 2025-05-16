import "./globals.css";
import { Inter } from 'next/font/google';
import 'sweetalert2/dist/sweetalert2.min.css'
import ClientNavLoader from '../components/ClientNavLoader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // กำหนดตัวแปรฟอนต์
});

export const metadata = {
  title: "ระบบจัดการหลังบ้าน",
  description: "ระบบจัดการหลังบ้าน",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600;700&family=Prompt:wght@100;300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
      </head>
      <body className={inter.variable}>
        <ClientNavLoader />
        {children}
      </body>
    </html>
  );
}
