import type Dimensions from './dimensions'

  /**
   * Defines a in image to render.
   * ImageDef is part of {@link LinkDef}
   */
interface ImageDef {
    /** image url */
  src: string     
    /** defaults to short filename */ 
  alt?: string
    /** See next js docs */
  sizes?: string
    /** 
     * Tailwind class for svg files (usually a text-<color>).  
     * All affect 'fill' props in the svg file 
     * must be set to 'currentColor'.
     */
  svgFillClass?: string
    /** rendered dim, unless style prop overrides
     * in which case the file resolution should
     * be supplied so that both Next and the browser 
     * can determine the aspect ratio
    */
  dim:  Dimensions 

  rounded?: string // any key from tailwind.config.borderRadius
}

export {
  type ImageDef as default
}