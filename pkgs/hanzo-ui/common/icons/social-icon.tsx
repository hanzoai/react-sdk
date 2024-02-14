import React from 'react'

import { SocialIcon as BaseSocialIcon } from 'react-social-icons'

import { cn } from '../../util'
import '../../style/social-svg.css'

interface SocialIconProps {
    // one of these: https://github.com/couetilc/react-social-icons/tree/main/db
  network: string
  size: number
  className?: string
}

const SocialIcon: React.FC<SocialIconProps> = ({
  network,
  size,
  className = ''
}) => (
  <BaseSocialIcon 
    network={network}
    as='div' 
      // This is set up so the enclosing element sets the color.
      // For example, something like 'color-foreground hover:color-muted-1' 
    className={cn('color-inherit', className)}
    bgColor='transparent' 
    fgColor='currentColor'
    style={{height: size, width: size}} 
  />
)

export {
  type SocialIconProps,
  SocialIcon as default
}
