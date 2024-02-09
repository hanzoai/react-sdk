import React from 'react'
import Image from 'next/image'

import type BlockComponentProps from './block-component-props'
import GridBlockComponent from './grid-block'
import type { Block, BulletCardsBlock } from '../def'
import type { Icon } from '../../types'



const CardIcon: React.FC<{
  icon: Icon | string
  size: number
}> = ({
  icon,
  size
}) => {
  if (!icon) return null

  if (typeof icon === 'string') {
    return <Image src={icon} width={size} height={size} alt='icon' className='mr-4'/>
  }
  return icon as Icon
}

const BulletCardsBlockComponent: React.FC<BlockComponentProps> = ({
  block,
  className='',
  agent
}) => {

  if (block.blockType !== 'bullet-cards') {
    return <>bullet cards block required</>
  }
  const b = block as BulletCardsBlock

  return (
    <GridBlockComponent block={{blockType: 'grid', grid: b.grid} as Block} className={className} agent={agent}>
    {b.cards.map((card, index) => (
      <div key={index} className='md:border md:border-muted-2 rounded px-6 py-2 md:py-4 flex flex-row justify-start items-center not-typography'>
        <CardIcon icon={card.icon} size={b.iconSize ?? 28}/>
        <p className='m-0'>{card.text}</p>
      </div>
    ))}
    </GridBlockComponent>
  )
}

export default BulletCardsBlockComponent
