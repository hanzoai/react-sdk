import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import type NextFontDesc from './next-font-desc'

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

  // first is automatically injected as default font for body (in app router) 
export default [
  {
    font: inter,
    cssVar: '--font-inter',
    twName: 'sans'
  },
  {
    font: drukTextWide,
    cssVar: '--font-druk-text-wide',
    twName: 'heading'
  },
] as NextFontDesc[]
