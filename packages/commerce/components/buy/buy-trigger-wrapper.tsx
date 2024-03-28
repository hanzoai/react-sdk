'use client'
import React from 'react'

import BuyMobileDrawer from './buy-drawer'

const BuyTriggerWrapper: React.FC<{
  skuPath: string
  trigger: React.ReactNode
  mobileTrigger?: React.ReactNode
}> = ({
  skuPath,
  trigger,
  mobileTrigger,
}) => (
  <BuyMobileDrawer skuPath={skuPath} trigger={trigger} />
)

export default BuyTriggerWrapper
