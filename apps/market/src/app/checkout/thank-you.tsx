import { type EnhHeadingBlock, ScreenfulBlockComponent, type ScreenfulBlock, type ElementBlock } from '@hanzo/ui/blocks'
import Link from 'next/link'

const ThankYou = () => {
  return (
    <ScreenfulBlockComponent block={{blockType: 'screenful',
      contentColumns: [[
        {blockType: 'enh-heading',
        specifiers: 'center byline-center',
        preheading: { text: 'Thank you for your purchase!', level: 1, mb: 10 },
        heading: { text: 'Once your payment has been confirmed we will send additional information to your email.', level: 5, mb: 10 },
      } as EnhHeadingBlock,
      {blockType: 'element',
        element: <h5 className='mx-auto text-center'>While you wait, we cordially invite you to join the <Link href='https://warpcast.com/~/channel/lux'>Lux Channel</Link> on <Link href='https://warpcast.com/~/invite-page/227706?id=fbc9ca91'>Warpcast</Link>.</h5>
      } as ElementBlock
      ]]
    } as ScreenfulBlock}/>
  )
}

export default ThankYou
