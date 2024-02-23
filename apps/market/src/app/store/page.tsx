import React  from 'react'
import { notFound } from 'next/navigation'

import { Footer } from '@hanzo/ui/common'
import { Main } from '@hanzo/ui/primitives'
import Store from './store'
import { products } from '@/content'

import siteDef from '../../siteDef'

type Props = {
//  params: { slug: 'silver' | 'gold' | 'coin' | 'credit' | 'validator' | 'pass' | 'uranium' }
  searchParams?: { [key: string]: string | string[] | undefined }
}


export async function generateMetadata({ searchParams}: Props) {
  return { title: 'Lux Bullion Store' }
}

const BullionStorePage = ({ searchParams }: Props) => {

  // see src/middleware.ts
  const agent = searchParams?.agent

  return (<>
    <Main className='md:flex-row md:gap-4 flex flex-row justify-center'>
        <Store searchParams={searchParams} className='' />
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
  </>)
}

export default BullionStorePage
