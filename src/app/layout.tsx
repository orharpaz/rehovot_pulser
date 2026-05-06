import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'רחובות מתעוררת',
  description: 'פעולה אזרחית — רחובות',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.variable} font-hebrew bg-brand-yellow`}>{children}</body>
    </html>
  )
}
