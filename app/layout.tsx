import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navigation from "./components/Navigation";
import { AuthProvider } from './context/AuthContext'

const poppins = Poppins({
  weight: "800",
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  title: "QWARKS",
  description: "QWARKS - Strategize. Code. Win.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{backgroundColor: "black", textAlign: "center", width: "100vw"}}
        className={`${poppins.className} antialiased`}
      >
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <AuthProvider>
            <Navigation/>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
