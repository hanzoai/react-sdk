'use client'
import React from 'react'

import BuyPopup from './buy-popup'
import BuyMobileDrawer from './buy-mobile-drawer'

const BuyTriggerWrapper: React.FC<{
  skuPath: string
  desktopTrigger: React.ReactNode
  mobileTrigger: React.ReactNode
  popupClx?: string
}> = ({
  skuPath,
  desktopTrigger,
  mobileTrigger,
  popupClx=''
}) => (<>
  <BuyPopup skuPath={skuPath} popupClx={popupClx}>
    {desktopTrigger}
  </BuyPopup>
  <BuyMobileDrawer skuPath={skuPath} trigger={mobileTrigger} />
</>
)

export default BuyTriggerWrapper
