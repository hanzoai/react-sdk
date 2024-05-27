'use client'

import { type Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import Reactmarkdown from 'react-markdown'

import { cn } from '../lib/utils'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './markdown'
import { IconOpenAI, IconUser } from './ui/icons'
import { ChatMessageActions } from './chat-message-actions'
import { useEffect, useState } from 'react'


export interface ChatMessageProps {
    message: Message
}


export function ChatMessage({ message, ...props }: ChatMessageProps) {

    return (
        <div
            className={cn('group relative mb-2 flex items-start md:mx-4')}
            {...props}
        >
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                    message.role === 'user'
                        ? 'bg-background'
                        : 'text-primary-foreground'
                )}
            >
                {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
            </div>
            <div className={cn("ml-4 flex-1 space-y-2 overflow-hidden px-1 rounded",
                message.role === 'user'
                    ? 'bg-zinc-950'
                    : 'text-primary-foreground')}>
                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        },
                        code({ node, inline, className, children, ...props }) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                                    )
                                }

                                children[0] = (children[0] as string).replace('`▍`', '▍')
                            }

                            const match = /language-(\w+)/.exec(className || '')

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            )
                        }
                    }}
                >
                    {message.content}
                </MemoizedReactMarkdown>
                <ChatMessageActions message={message} />
            </div>
        </div>
    )
}