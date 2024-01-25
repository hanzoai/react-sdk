import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const drukTextWide = localFont({
  src: [
    {
      path: './fonts/DrukTextWide-Medium-Trial.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/DrukTextWide-Bold-Trial.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: './fonts/DrukTextWide-Heavy-Trial.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-druk-text-wide' ,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default [
  inter,
  drukTextWide
]
