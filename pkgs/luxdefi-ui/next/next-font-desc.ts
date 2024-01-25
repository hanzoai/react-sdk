// from next repo
type CssVariable = `--${string}`

// from next repo
type NextFont = {
  className: string
  style: { fontFamily: string; fontWeight?: number; fontStyle?: string }
}

// from next repo
type NextFontWithVariable = NextFont & {
  variable: string
}

interface NextFontDesc {
  font: NextFontWithVariable
  twName: string
  cssVar: CssVariable
}

export {
  type NextFontDesc as default,
  type NextFont,
  type NextFontWithVariable,
  type CssVariable
}