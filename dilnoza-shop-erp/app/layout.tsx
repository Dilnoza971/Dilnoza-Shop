import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Dilnoza Shop ERP',
  description: 'Created by Dilnoza Shop',
  generator: 'Dilnoza Shop',
  applicationName: 'Dilnoza Shop ERP',
  referrer: 'origin-when-cross-origin',
  keywords: ['Dilnoza', 'Shop', 'ERP'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
         attribute="class" 
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
        </body>
    </html>
  )
}
