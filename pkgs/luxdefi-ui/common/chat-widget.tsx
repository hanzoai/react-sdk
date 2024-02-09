'use client'

import React from 'react'

import { MessageCircleMore, X } from 'lucide-react'

import { Button, Card, cn } from '..'

const ChatWidget: React.FC<{
  title: string,
  chatbotUrl: string,
  question?: string,
}> = ({
  title,
  chatbotUrl,
  question
}) => {
    const [showChatbot, setShowChatbot] = React.useState(false)

    return (
      <>
        <div className={cn('fixed bottom-0 sm:bottom-20 right-0 w-full sm:max-w-[400px] h-full sm:max-h-[550px] sm:px-4 z-[1001]', showChatbot ? 'opacity-100 flex' : 'opacity-0 hidden')}>
          <Card className='flex flex-col h-full w-full'>
            <div className='flex px-4 py-2 h-12 bg-level-0 items-center justify-between'>
              <h3 className='font-semibold font-heading'>{title}</h3>
              <Button onClick={() => setShowChatbot(!showChatbot)} variant='link' size='icon' className='w-fit sm:hidden'>
                <X />
              </Button>
            </div>
            <iframe src={`${chatbotUrl}${question ? `?question=${question}` : ''}`} className='h-full' />
          </Card>
        </div>

        <Button
          variant='outline'
          size='link'
          onClick={() => setShowChatbot(!showChatbot)}
          className='fixed bottom-4 right-0 h-12 w-12 mx-4 rounded-full'
        >
          {showChatbot ? <X /> : <MessageCircleMore />}
        </Button>
      </>
    )
  }

export default ChatWidget

