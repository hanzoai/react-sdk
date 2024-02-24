import React  from 'react'

import { Footer } from '@hanzo/ui/common'
import { Main, TailwindIndicator } from '@hanzo/ui/primitives'
import Store from './store'

import siteDef from '../../siteDef'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams}: Props) {
  return { title: 'Lux Store' }
}

const BullionStorePage = ({ searchParams }: Props) => {

  // see src/middleware.ts
  const agent = searchParams?.agent as string

  // must override: p-4 md:px-6 lg:px-8 
  return (<>
    <Main className={
      'md:flex-row md:gap-4 min-h-[100vh] sm:min-h-[80vh] flex flex-row justify-center ' +
      '2xl:mx-auto max-w-screen-2xl ' + 
      'p-0 px-4 md:px-6 lg:px-8'
    }>
      <Store searchParams={searchParams} agent={agent} className='max-w-full' />
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
    <TailwindIndicator />
  </>)
}

export default BullionStorePage
