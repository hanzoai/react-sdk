import type { Config } from 'tailwindcss'

export type { default as TwFontDesc } from './tw-font-desc'

// @ts-ignore
import _preset from './tailwind.config.hanzo-preset'
export const preset = _preset as unknown as Config
