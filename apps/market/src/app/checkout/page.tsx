'use client'

import React from 'react'
import { useObserver } from 'mobx-react'

import getStore from '@hanzo/cart/shop2Js/store'
import Client from 'hanzo.js'

import { Checkout, PaymentForm, ShippingForm } from '@hanzo/cart/shop2Js'
import { CLIENT } from '../../settings/hanzo'

if (typeof window !== 'undefined') {
  getStore( new Client(CLIENT), (window as any).analytics)
}

export default () => {
  const shopStore = getStore()

  return useObserver(() => (
    <Checkout
      forms={[PaymentForm, ShippingForm]}
      stepLabels={['Payment Info', 'Shipping Info', 'Confirm Order']}
      contactIcon={undefined}
      contactTitle={undefined}
      shippingIcon={undefined}
      shippingTitle={undefined}
      paymentIcon={undefined}
      paymentTitle={undefined}
      cartIcon={undefined}
      cartTitle={undefined}
      address={shopStore.address}
      setAddress={(k: string, v: any) => shopStore.setAddress(k, v)}
      order={shopStore.order}
      setOrder={(k: string, v: any) => shopStore.setOrder(k, v)}
      payment={shopStore.payment}
      setPayment={(k: string, v: any) => shopStore.setPayment(k, v)}
      user={shopStore.user}
      setUser={(k: string, v: any) => shopStore.setUser(k, v)}
      setCoupon={(c: string) => shopStore.setCoupon(c)}
      checkout={() => shopStore.checkout() }
      setItem={(id: string, quantity: number) => shopStore.setItem(id, quantity)}
      countryOptions={ shopStore.countryOptions }
      stateOptions={ shopStore.stateOptions }
      isLoading={ shopStore.isLoading }
      track={(event, opts) => shopStore.track(event, opts)}
      termsUrl={'/terms'}
      showDescription
      showTotals
      cartCheckoutUrl={undefined}
      nativeSelects
      cart={shopStore.commerce.cart}
    />
  ))
}