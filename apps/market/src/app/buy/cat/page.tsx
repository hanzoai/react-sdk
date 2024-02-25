import React  from 'react'

import { Footer } from '@hanzo/ui/common'
import { Main, TailwindIndicator } from '@hanzo/ui/primitives'
import ProductFocusedView from './store-category-view'

import siteDef from '@/siteDef'

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
    <Main id='BUY_CAT_MAIN' className={ 
      'flex flex-row justify-center ' + 
      'min-h-[100vh] sm:min-h-[90vh] ' +
      'lg:min-w-screen-lg ' + 
      'max-w-screen-2xl 2xl:mx-auto ' + 
      'p-0 px-4'
    }>
      <ProductFocusedView agent={agent} className='w-full' />
    </Main>
    <Footer siteDef={siteDef} className='max-w-screen-2xl w-full pt-16 lg:mx-auto ' />
    <TailwindIndicator />
  </>)
}

export default BullionStorePage
