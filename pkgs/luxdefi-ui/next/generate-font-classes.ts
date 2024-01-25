import luxFonts from './lux-fonts'
import type NextFontDesc from './next-font-desc'

  // first is assumed to be mapped to 'sans'
  // These will be injected for <body> in app router app that uses our RootLayout
export default () => (
  `${luxFonts.map((fd: NextFontDesc) => (fd.font.variable)).join(' ')} font-${luxFonts[0].twName}`  
)