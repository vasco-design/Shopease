import './globals.css'
import { ReactNode } from 'react'
import { CartProvider } from '@/lib/cart'
import Navbar from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'ShopEase',
  description: 'Your one-stop shop for all your needs',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
