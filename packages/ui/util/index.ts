import { compiler as mdCompiler } from 'markdown-to-jsx'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Dimensions } from '../types'

  // @ts-ignore
import _merge from 'lodash.merge'

export const cn = (...inputs: ClassValue[]) => (
  twMerge(clsx(inputs))  
) 

export const DEF_VIDEO_PROPS = {
  autoPlay: true, 
  loop: true, 
  muted: true, 
  playsInline: true
}

export const markdown = (s: string, options?: any): JSX.Element => (
  mdCompiler(s, {
    wrapper: null,
    ...options
  })
)

export const round = (num: number): string  => (
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
)

export const pxToRem = (px: number, base: number): string => (`${round(px / base)}rem`)

export const pxToEm = (px: number, base: number): string  => (`${round(px / base)}em`)

export const hexToRgb = (hex: string): string => {
  hex = hex.replace('#', '')
  hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}


export const asNum = (n: number | `${number}`): number => (
  (typeof n === 'number') ? n : parseInt(n, 10)  
)

export const resolveDimensions = (dim: Dimensions, constraint?: {w: number, h: number}): {w: number, h: number} => {

  const resolved = ('w' in dim) ? 
    (('h' in dim) ? {w: dim.w, h: dim.h} : { w: dim.w, h: dim.w / dim.ar }) : { w: dim.h * dim.ar, h: dim.h }

  return constraint ? constrain(resolved, constraint) : resolved
}

  // https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
export const constrain = (d: {w: number, h: number}, c: {w: number, h: number}): {w: number, h: number} => {

  const ratio = Math.min(c.w / d.w, c.h / d.h)
  return {
    w: Math.round(d.w * ratio),
    h: Math.round(d.h * ratio)
  }
}

export const containsToken = (s: string | undefined, toFind: string): boolean => (s ? s.split(' ').includes(toFind) : false)

export const ldMerge = (
  result: any,
  ...sources: any[]
): any => (_merge(result, ...sources))

export const capitalize = (str: string): string => (
  str.charAt(0).toUpperCase() + str.slice(1)
)
