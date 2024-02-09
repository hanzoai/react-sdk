import React from 'react'
import Image from 'next/image'

import type { Icon } from '../../types'
import { cn } from '../../util'


const InlineIcon: React.FC<{
  icon: Icon | string
  size?: number
  className?: string
}> = ({
  icon,
  size,
  className=''
}) => {
  if (!icon) return null

  if (typeof icon === 'string') {
    return <Image src={icon} width={size} height={size} alt='icon' className={cn('mr-4', className)}/>
  }
  return icon as Icon
}

export default InlineIcon
