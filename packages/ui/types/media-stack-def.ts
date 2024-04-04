import type ImageDef from './image-def'
import type VideoDef from './video-def'

interface MediaStackDef {
  img?: ImageDef
  video?: VideoDef
  animation?: string
}

export { type MediaStackDef as default }