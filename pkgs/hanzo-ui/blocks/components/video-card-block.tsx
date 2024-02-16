import React from 'react'

import type VideoCardBlock from '../def/video-card-block'
import { VideoBlockComponent, type BlockComponentProps, CTABlockComponent } from '.'
import { DEF_VIDEO_PROPS, cn, containsToken } from '../../util'
import type { VideoBlock } from '..'

const VideoCardBlockComponent: React.FC<BlockComponentProps> = ({
  block,
  className='',
  agent
}) => {

  if (block.blockType !== 'video-card') {
    return <>video card block required</>
  }

  const b = block as VideoCardBlock

  const specified = (s: string) => (containsToken(b.specifiers, s))
  const outerBorderClx = specified('no-outer-border') ? 'border-none' : 'border rounded-lg'
  const videoBorderClx = specified('video-border') ? 'border rounded-lg p-2' : 'border-none'

  const mobileVideoBlock = {blockType: 'video',
    sources: b.video.sources,
    poster: b.video.poster,
    videoProps: DEF_VIDEO_PROPS,
    dim: b.video.dim,
    sizing: {vh: 5}
  } as VideoBlock

  const desktopVideoBlock = {blockType: 'video',
    sources: b.video.sources,
    poster: b.video.poster,
    videoProps: DEF_VIDEO_PROPS,
    dim: b.video.dim,
    sizing: {vh: 25}
  } as VideoBlock

  return (
    <div className={cn('flex flex-col gap-2 p-4 sm:p-6 md:p-12 sm:text-center', outerBorderClx)}>
      <div className={cn('typography-video:my-auto flex sm:flex-col gap-4 items-center self-start sm:self-center', className)}>
        {agent === 'phone' ? (
          <div className='w-15'>
            <VideoBlockComponent block={mobileVideoBlock} className={videoBorderClx}/>
          </div>
        ) : (
          <VideoBlockComponent block={desktopVideoBlock} className={videoBorderClx}/>
        )}
        {b.title && <h3 className={cn('text-foreground font-heading', className)}>{b.title}</h3>}
      </div>
      {b.description && <p>{b.description}</p>}
      {b.cta && <CTABlockComponent block={b.cta} />}
    </div>
  )
}

export default VideoCardBlockComponent