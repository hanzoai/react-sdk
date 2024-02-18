import React from 'react'
import SVG_Amex from './images/payment-methods/amex.svg'
import SVG_ApplePay from './images/payment-methods/apple-pay.svg'
import SVG_Discover from './images/payment-methods/discover.svg'
import SVG_Mastercard from './images/payment-methods/mastercard.svg'
import SVG_Visa from './images/payment-methods/visa.svg'
import SVG_Paypal from './images/payment-methods/paypal.svg'
import CtaBlockComponent from '@hanzo/ui/blocks/components/cta-block'
import type { CTABlock } from '@hanzo/ui/blocks'
import type { LinkDef } from '@hanzo/ui/types'

const Footer = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <SVG_Amex />
        <SVG_ApplePay />
        <SVG_Discover />
        <SVG_Mastercard />
        <SVG_Visa />
        <SVG_Paypal />
      </div>
      <hr/>
      <CtaBlockComponent block={{blockType: 'cta', elements: [
        {title: 'Refund policy', href: 'https://karmabikinis.online/policies/refund-policy'} as LinkDef,
        {title: 'Shipping policy', href: 'https://karmabikinis.online/policies/shipping-policy'} as LinkDef,
        {title: 'Privacy policy', href: '/privacy'} as LinkDef,
        {title: 'Terms of service', href: '/terms'} as LinkDef,
      ]} as CTABlock} />
    </div>
  )
}

export default Footer