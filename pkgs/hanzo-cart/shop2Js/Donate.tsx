'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useObserver } from 'mobx-react'
import classNames from 'classnames'

import akasha from 'akasha'

import {
  Button,
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Grow,
  Hidden,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core'

import { red } from '@material-ui/core/colors'

import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowLeft as BackChevron
} from '@material-ui/icons'

import { isEmail, isRequired } from '@hanzo/middleware'

import { MUICheckbox, MUIText } from '@hanzo/react'
import { renderUICurrencyFromJSON } from '@hanzo/utils'


import useMidstream from './hooks'
import { identify, track as track2 } from './track'

import Cart from './Cart'
import PaymentForm from './PaymentForm'
import ShippingForm from './ShippingForm'
import ThankYou from './ThankYou'
import Steps from './Steps'
import Footer from './Footer'

import getStore from './store'
import Client from 'hanzo.js'

import { CLIENT } from '../settings/hanzo'

getStore(new Client(CLIENT), typeof window !== 'undefined' ? (window as any).analytics : undefined)

const INFO_STEP = 0
const CONFIRM_STEP = 1

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflowX: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  rootContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.up('lg')]: {
      maxWidth: 1100,
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '90%',
    },
  },
  notFirstPage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  formGrid: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    paddingTop: '4rem',
    paddingRight: '6%',
    paddingBottom: '4rem',
  },
  error: {
    color: red[500],
    paddingTop: theme.spacing(1),
  },
  checkoutGrid: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  compactCart: {
    [theme.breakpoints.down('sm')]: {
      '& .cart-your-items-title': {
        display: 'none',
      },
      '& .cart-icon': {
        display: 'none',
      },
      '& .cart': {
        padding: 0,
      },
      '& .cart-items': {
        paddingTop: 0,
      },
    },
  },
  cartRight: {
    position: 'relative',
    color: '#FFF',

    [theme.breakpoints.up('md')]: {
      paddingTop: '4rem',
      paddingLeft: '4%',
      background: '#111',

      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50vw',
        background: '#111',
        zIndex: -1,
      },
    },

    [theme.breakpoints.down('sm')]: {
      paddingTop: '2rem',
      '& #cart-items-header *': {
        color: '#000',
      },

      '& #cart-items-content > *': {
        backgroundColor: '#111',
      },

      '& .cart-show-more-summary-text': {
        marginBottom: 0,
      },
    },

    '& *': {
      color: '#FFF',
    },

    '& .MuiSelect-icon': {
      right: -8,
    },
  },
  checkoutFormGrid: {
    paddingRight: '6%',
  },
  logo: {
    maxHeight: '2.8571428571em',
    display: 'inline-block',
  },
  logoGrid: {
    textAlign: 'center',
  },
  logoGrid2: {
    textAlign: 'center',
    paddingTop: '4rem',
  },

  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },

  button: {
    fontSize: '.9rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    lineHeight: 1.42,

    padding: '12px 24px',
    backgroundColor: '#000',
    color: '#FFF',
      // @ts-ignore
    borderRadius: theme.ext.radius(),
  },
  terms: {
    '& .MuiFormControlLabel-label': {
      marginBottom: 0,
    },
  },
  textButton: {
    cursor: 'pointer',
    textDecoration: 'none !important',
    '& > *' :{
      textDecoration: 'inherit',
    },
    '&:hover': {
      fontWeight: 500
    }
  },
  returnToCampaign: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > * ': {
      display: 'block'
    }
  },
}))

const agreed = (v) => {
  if (!v) {
    throw new Error('Agree to our terms and conditions.')
  }

  return v
}

const Donate = ({
  forms,
  setAddress,
  payment,
  setPayment,
  setOrder,
  donationAmount,
  user,
  setUser,
  setCoupon,
  checkout,
  setItem,
  countryOptions,
  stateOptions,
  isLoading,
  termsUrl,
  track,
  stepLabels,
  contactIcon,
  contactTitle,
  shippingIcon,
  shippingTitle,
  paymentIcon,
  paymentTitle,
  cartIcon,
  cartTitle,
  showDescription,
  showTotals,
  nativeSelects,
}) => {

  const item = {
    productId:   '5',
    productSlug: 'contribution',
    price:       donationAmount * 100,
    name:        'Donate to Karma',
    description: 'Donate in Karma because our mission speaks to you',
    locked:      true,
    quantity:    1,
    imageURL:    '',
  }

  const cart = {
    id: '000',
    items: [item],
  }

  const order = {
    mode:     'contribution',
    couponCodes: [],
    subtotal: donationAmount * 100,
    total:    donationAmount * 100,
    currency: 'USD',
    items:    [item],
    shippingAddress: {
      city: 'LA',
      country: 'USA',
    },
  }

  const shopStore = getStore()
  shopStore.order.items = []
  shopStore.order.mode = 'contribution'
  shopStore.order.subtotal = donationAmount * 100

  const s = useStyles()

  const splitName = (v) => {
    const [firstName, lastName] = v.split(/\s+/)
    setUser('firstName', firstName)
    setUser('lastName', lastName)

    return v
  }

  const setPaymentName = (v) => {
    setPayment('name', v)
    return v
  }

  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(INFO_STEP)
  const [formAwait, _setFormAwait] = useState(null)

  const userMS = useMidstream(
    {
      email: [isRequired, isEmail],
      name: [isRequired, splitName, setPaymentName],
    },
    {
      dst: setUser,
    },
  )

  const { setEmail, setName } = userMS

  const userErr = userMS.err
  const userRun = userMS.runAll

  const termsMS = useMidstream(
    {
      terms: [agreed],
    },
  )

  const { setTerms, err, src } = termsMS

  const termsRun = termsMS.run

  useEffect(() => {
    const items = {}
    for (const i in order.items) {
      const item = order.items[i]
      items[`product.${i}.id`] = item.productId
      items[`product.${i}.slug`] = item.productSlug
      items[`product.${i}.price`] = item.price
    }

    track('Viewed Checkout Step', { step: 2 })
    track2('Viewed Checkout Step', {
      step: 2,
      ...items,
      cartId: cart.id,
    })
  }, [])

  const setFormAwait = useMemo(
    () => (x) => {
      if (x !== formAwait) {
        _setFormAwait(() => x)
      }
    },
    [],
  )

  const handleNext = async () => {
    const fn = formAwait

    if (fn) {
      try {
        // @ts-ignore
        await fn()
      } catch (e) {
        console.log('checkout form error', e)
        return
      }
    }

    if (activeStep === INFO_STEP) {
      const ret = await userRun()

      if (ret instanceof Error) {
        console.log('contact form error', ret)
        return
      }
    }

    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === INFO_STEP) {
        const items = {}
        for (const i in order.items) {
          const item = order.items[i]
          items[`product.${i}.id`] = item.productId
          items[`product.${i}.slug`] = item.productSlug
          items[`product.${i}.price`] = item.price
        }

        track('Completed Checkout Step', { step: 2 })
        track2('Completed Checkout Step', {
          step: 2,
          ...items,
          // cartId: cart.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        })
        track2('Payment Info Entered', {
          cartId: cart.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        })
        track('Viewed Checkout Step', { step: 3 })
        track2('Viewed Checkout Step', {
          step: 3,
          ...items,
          cartId: cart.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        })
        identify({
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        })
      }

      return prevActiveStep + 1
    })
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSubmit = async () => {
    try {
      const fn = formAwait

      if (fn) {
        try {
          // @ts-ignore
          await fn()
        } catch (e) {
          console.log('checkout form error', e)
          return
        }
      }

      const ret = await termsRun()

      if (ret instanceof Error) {
        return
      }

      await checkout()

      const items = {}
      for (const i in order.items) {
        const item = order.items[i]
        items[`product.${i}.id`] = item.productId
        items[`product.${i}.slug`] = item.productSlug
        items[`product.${i}.price`] = item.price
      }

      if (typeof window !== 'undefined') {
        const d = {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          referred_by: akasha.get('referrer'),
          city: order.shippingAddress.city,
          country: order.shippingAddress.country,
          revenue: order.total,
          currency: order.currency,
        }

        track2('Order Completed', {
          ...d,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          coupon: order.couponCodes,
          ...items,
          cartId: cart.id,
        })
      }

      setFormAwait(null)

      track('Completed Checkout Step', { step: 3 })
      track2('Completed Checkout Step', {
        step: 3,
        ...items,
        cartId: cart.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      })

      identify({
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
      })

      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    } catch (e) {
      console.log('payment form error', e)

      setError(e.message)
    }
  }

  let Forms

  if (!forms || !forms.length) {
    Forms = [ShippingForm, PaymentForm]
  }
  else if (forms.length === 1) {
    Forms = [forms[0], PaymentForm]
  }
  else {
    Forms = [forms[0], forms[1]]
  }

  if (order.mode === 'contribution') {
    Forms = [PaymentForm]
  }

  const disabled = !(
    order.items
    && order.items.length
    && order.items.length > 0
  )

  return useObserver(() => (
    <div className={s.root}>
      <Container maxWidth='lg' className={s.rootContainer} onMouseDown={(event) => { event.stopPropagation() }}>
        <Hidden mdUp>
          <Grid container >
            <Grid item xs={12} className={s.logoGrid2}>
              <img
                className={s.logo}
                alt='Karma Bikinis'
                src='//cdn.shopify.com/s/files/1/0261/7183/4445/files/karma-logo.png?1434'
              />
            </Grid>
            <Grid item xs={12} className='checkout-steps'>
              <Steps activeStep={activeStep} steps={stepLabels} />
            </Grid>
          </Grid>
        </Hidden>
        <Grid container className={classNames(s.checkoutGrid, 'checkout-layout')} >
          <Grid item xs={12} md={7} className={classNames(s.formGrid, 'checkout-forms')}  >
            <Hidden smDown>
              <Grid container spacing={3}>
                <Grid item xs={12} className={s.logoGrid}>
                  <img
                    className={s.logo}
                    alt='Karma Bikinis'
                    src='//cdn.shopify.com/s/files/1/0261/7183/4445/files/karma-logo.png?1434'
                  />
                </Grid>
                <Grid item xs={12} className='checkout-steps'>
                  <Steps activeStep={activeStep} steps={stepLabels} />
                </Grid>
              </Grid>
            </Hidden>
            {Forms.map((Form, i) => (
              <Grow in={activeStep === i} key={Form}>
                <div style={{ height: activeStep === i ? 'inherit' : 0 }} className='checkout-form'>
                  <Grid container spacing={3} className={s.checkoutFormGrid} >
                    {activeStep === INFO_STEP && (
                      <>
                      <Grid item xs={12} className='contact-header'>
                        <Grid container spacing={1} alignItems='center'>
                          <Grid item className='contact-icon'>
                            {contactIcon || (<PersonIcon style={{ fontSize: '2rem' }} />)}
                          </Grid>
                          <Grid item className='contact-title'>
                            {contactTitle || (<Typography variant='h6'>Contact Details</Typography>)}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6} className='contact-name'>
                        <MUIText
                          fullWidth
                          label='Name'
                          variant={undefined}
                          size='medium'
                          value={user.name}
                          setValue={setName}
                          error={userErr.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} className='contact-email'>
                        <MUIText
                          fullWidth
                          label='Email'
                          variant={undefined}
                          size='medium'
                          value={user.email}
                          setValue={setEmail}
                          error={userErr.email}
                        />
                      </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Form
                        isActive={activeStep === i}
                        shippingIcon={shippingIcon}
                        shippingTitle={shippingTitle}
                        paymentIcon={paymentIcon}
                        paymentTitle={paymentTitle}
                        order={order}
                        payment={payment}
                        user={user}
                        setUser={setUser}
                        setAddress={setAddress}
                        setPayment={setPayment}
                        setFormAwait={setFormAwait}
                        countryOptions={countryOptions}
                        stateOptions={stateOptions}
                        isLoading={isLoading}
                        termsUrl={termsUrl}
                        nativeSelects={nativeSelects}
                      />
                    </Grid>
                    <Grid item xs={12} className={classNames('checkout-terms', s.terms)}>
                      <MUICheckbox
                        label={
                          <Link href={termsUrl} target='_blank'>
                            I agree to Karma's terms and conditions.
                          </Link>
                        }
                        placeholder='123'
                        size='medium'
                        value={src.terms}
                        error={err.terms}
                        setValue={setTerms}
                      />
                    </Grid>
                    {error && (<Grid item xs={12}><div className={classNames(s.error, 'checkout-errors' )}>{error}</div></Grid>)}
                    <Grid item xs={12} className='checkout-buttons-gridcell'>
                      {activeStep === INFO_STEP && (
                        <div className={classNames(s.buttons, 'checkout-buttons')}>
                          <Link href='/' className={s.textButton}>
                            Back to Campaign
                          </Link>
                          <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            className={s.button}
                            onClick={handleSubmit}
                            disabled={isLoading || disabled}
                          >
                            Pay Now
                          </Button>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </div>
              </Grow>
            ))}
            {activeStep === CONFIRM_STEP && (
              <Grow in={activeStep === CONFIRM_STEP}>
                <>
                <div style={{ height: activeStep === CONFIRM_STEP ? 'inherit' : 0 }} >
                  <ThankYou order={order} isDonation={true} />
                  <div className={s.buttons}>
                    <Link href='/' className={classNames(s.textButton, s.returnToCampaign)}>
                      <BackChevron/>Return to Campaign
                    </Link>
                  </div>
                </div>
                </>
              </Grow>
            )}
            <Footer />
          </Grid>
          <Grid item xs={12} md={5} className={classNames( s.cartRight, 'checkout-cart')}>
            <Hidden mdUp>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='cart-items-content'
                  id='cart-items-header'>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item xs>
                      <Typography
                        variant='body1'
                        className='cart-show-more-summary-text'>
                        Show Order
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant='h6'
                        className='cart-show-more-summary-price'>
                          {renderUICurrencyFromJSON(
                            order.currency,
                            order.total,
                          )}
                      </Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={s.compactCart}>
                  <Cart
                    cartIcon={cartIcon}
                    cartTitle={cartTitle}
                    order={order}
                    setCoupon={setCoupon}
                    setItem={setItem}
                    locked={isLoading || activeStep === CONFIRM_STEP}
                    showDescription={showDescription}
                    showTotals={showTotals}
                    cartCheckoutUrl={undefined}
                    nativeSelects={nativeSelects}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Hidden>
            <Hidden smDown>
              <Cart
                contributionMode={true}
                cartIcon={cartIcon}
                cartTitle={cartTitle}
                order={order}
                setCoupon={setCoupon}
                setItem={setItem}
                locked={isLoading || activeStep === CONFIRM_STEP}
                showDescription={showDescription}
                showTotals={showTotals}
                cartCheckoutUrl={undefined}
                nativeSelects={nativeSelects}
              />
            </Hidden>
          </Grid>
        </Grid>
      </Container>
    </div>
  ))
}

export default Donate
