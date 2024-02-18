import React, { useState } from 'react'
import { useObserver } from 'mobx-react'
import classnames from 'classnames'

import {
  MUIText,
} from '@hanzo/react'

import {
  renderUICurrencyFromJSON,
} from '@hanzo/utils'

import {
  Button,
  Grid,
  Link,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

const useStyles = makeStyles((theme) => ({
  right: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: 700,
  },
  coupon: {
    paddingBottom: theme.spacing(2),
  },
  lineSpacing: {
    paddingBottom: theme.spacing(1),
  },
  total: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    '& > *': {
      fontWeight: 800,
    },
  },
  couponInput: {
    '& .MuiInputBase-root': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRight: 0,
    },
  },

  couponButton: {
    borderTopLeftRadius: '0 !important',
    borderBottomLeftRadius: '0 !important',
    border: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    height: '41px',

    backgroundColor: 'white !important',
    color: 'black',

    '&:hover': {
      backgroundColor: '#d5d5d5 !important'
    },

    '& > span': {
      color: 'black'
    },

    '& > span:hover, & > span:active, & > span:focus':  {
      fontWeight: 600,
    },
  },
  cart: {
  },
  cartItems: {
    paddingTop: theme.spacing(2),
  },
  cartItem: {
    paddingBottom: theme.spacing(2),
  },
  cartItemPrice: {
    transform: 'translate(0, 6px)',
  },
  cartItemImg: {
    width: 120,
    maxWidth: '33%',
  },
  cartImg: {
    border: 'none',
    width: '100%',
  },
  cartDescription: {
    '& *': {
      margin: 0,
    },
  },
  summaryNumber: {
    width: 120,
    maxWidth: '40%',
  },
  checkoutButton: {
    marginTop: theme.spacing(2),
  },
}))

const quantityOpts = {}

for (let i = 0; i < 10; i++) {
  quantityOpts[i] = i
}

const Cart = ({
  order,
  setCoupon,
  setItem,
  locked,
  cartIcon,
  cartTitle,
  showDescription,
  showTotals,
  cartCheckoutUrl,
  nativeSelects,
}) => useObserver(() => {
  const classes = useStyles()

  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(undefined)

  const hasCountry = !!order.shippingAddress.country
  const hasState = !!order.shippingAddress.state
  const hasShipping = !!order.shipping
  const hasTax = !!order.tax
  const canCalculate = (hasCountry && hasState) || hasTax || hasShipping

  return (
    <div
      className={classnames('cart', classes.cart)}
      onMouseDown={(event) => {
        event.stopPropagation()
      }}
    >
      <Grid container>
        <Grid item xs={12} className='cart-header'>
          <Grid container spacing={1} alignItems='center'>
            <Grid item className='cart-icon'>
              { cartIcon || <ShoppingCartIcon style={{ fontSize: '2rem' }}/> }
            </Grid>
            <Grid item className='cart-title'>
              { (order.items && order.items.length && order.items.length > 0)
                ? cartTitle || (
                    <Typography variant='h6' className='cart-your-items-title'>
                      Your Cart
                    </Typography>
                ) : (
                  <Typography variant='h6' className='cart-is-empty-title'>
                    Your Cart Is Empty.
                  </Typography>
                )
              }
            </Grid>
          </Grid>
        </Grid>
        {
          !!(order.items && order.items.length && order.items.length > 0)
            && <Grid item xs={12}>
              <div className={classnames(classes.cartItems, 'cart-items')}>
                {
                  order.items.map((item) => (
                    <Grid container alignItems='center' key={item.name} className={classnames('cart-item', classes.cartItem)}>
                      {
                        item.imageURL
                          ? (
                            <>
                              <Grid container spacing={2}>
                                <Grid item className={ classnames('cart-item-image', classes.cartItemImg) }>
                                  <img src={item.imageURL} alt={item.name} className={classes.cartImg}/>
                                </Grid>
                                <Grid item xs className='cart-item-text'>
                                  <Typography className='cart-item-name' variant='body1'>
                                    <strong>{ item.name }</strong>
                                  </Typography>
                                  {
                                    showDescription !== false && <Typography className={ classnames('cart-item-description', classes.cartDescription) } variant='body2' dangerouslySetInnerHTML={{ __html: item.description }}/>
                                  }
                                  <br/>
                                </Grid>
                              </Grid>
                              <Grid container spacing={2}>
                                <Grid item xs className='cart-item-spacer'/>
                                <Grid item className={classnames(classes.cartItemPrice, classes.right, 'cart-item-price')}>
                                  <Typography variant='body1'>
                                    { renderUICurrencyFromJSON(order.currency, item.price) }&nbsp;x
                                  </Typography>
                                </Grid>
                                <Grid item className={classnames(classes.right, 'cart-item-quantity')}>
                                  <MUIText
                                    select
                                    disabled={ item.locked || locked}
                                    options={quantityOpts}
                                    value={ item.quantity }
                                    setValue={ (quantity) => {
                                      setItem(item.id, parseInt(quantity, 10))
                                    }}
                                    SelectProps={{ native: !!nativeSelects }}
                                  />
                                </Grid>
                              </Grid>
                              <br/>
                            </>
                          ) : (
                            <>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8} className='cart-item-name'>
                                  <Typography variant='body1'>
                                    { item.name }
                                  </Typography>
                                  <Typography variant='body2'>
                                    { item.description }
                                  </Typography>
                                  <br/>
                                </Grid>
                                <Grid item xs={8} sm={2} className={classnames(classes.right, 'cart-item-price')}>
                                  <Typography variant='body1'>
                                    { renderUICurrencyFromJSON(order.currency, item.price) }&nbsp;x
                                  </Typography>
                                </Grid>
                                <Grid item xs={4} sm={2} className={classnames(classes.right, 'cart-item-quantity')}>
                                  <MUIText
                                    select
                                    disabled={ item.locked || locked}
                                    value={ item.quantity }
                                    setValue={ (quantity) => {
                                      setItem(item.id, parseInt(quantity, 10))
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <br/>
                            </>
                          )
                        }
                      </Grid>
                  ))
                }
              </div>
            </Grid>
        }

        { !!(order.items && order.items.length && order.items.length > 0) && <>
                <Grid item xs={12} className={classnames(classes.coupon, 'cart-coupon')}>
                  { !(order.mode === 'contribution') && <Grid container>
                        <Grid item xs={8} sm={10} md={9}>
                          <MUIText
                            className={classes.couponInput}
                            fullWidth
                            disableAutoChange
                            variant='outlined'
                            size='small'
                            placeholder='Coupon Code'
                            defaultValue={ order.couponCodes[0] }
                            setValue={ async (c) => {
                              try {
                                setCodeError(undefined)
                                await setCode(c)
                              } catch (e) {
                                setCodeError(e)
                              }
                            }}
                            disabled={locked}
                            error={codeError ? 'Invalid Coupon Code' : ''}
                          />
                        </Grid>
                        <Grid item xs={4} sm={2} md={3}>
                          <Button
                            className={classes.couponButton}
                            fullWidth
                            disableElevation
                            size='medium'
                            variant='contained'
                            disabled={locked}
                            onClick={ async () => {
                              try {
                                setCodeError(undefined)
                                await setCoupon(code)
                              } catch (e) {
                                setCodeError(e)
                              }
                            }}
                          >
                            APPLY
                          </Button>
                        </Grid>
                      </Grid>
                  }
                </Grid>

            <Grid item xs={12} className='cart-summary'>
              <div className='cart-summary-wrapper'>
                <div className='cart-totals'>
                { (order.mode !== 'contribution' && !canCalculate) && (
                    <Grid container className={classnames(classes.lineSpacing, 'cart-summary-calculation-message')}>
                      <Grid item xs={12} className={classes.right}>
                        <Typography variant='body2'
                          style={{ paddingTop: '16px' }}
                        >
                          Shipping and tax will be calculated during checkout.
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                }
                {
                  (canCalculate || order.discount > 0) && (
                    <Grid container className={classnames(classes.lineSpacing, 'cart-summary-subtotal')}>
                      <Grid item xs className={classes.right}>
                        <Typography variant='body1'>
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid item className={classnames(classes.right, classes.summaryNumber)}>
                        <Typography variant='body1'>
                          { renderUICurrencyFromJSON(order.currency, order.subtotal) }
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                }
                {
                  order.discount > 0 && (
                    <Grid container className={classnames(classes.lineSpacing, 'cart-summary-discount')}>
                      <Grid item xs className={classes.right}>
                        <Typography variant='body1'>
                          You Saved
                        </Typography>
                      </Grid>
                      <Grid item className={classnames(classes.right, classes.summaryNumber)}>
                        <Typography variant='body1'>
                          { renderUICurrencyFromJSON(order.currency, order.discount) }
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                }
                {
                  showTotals !== false && (
                    <>
                      {
                        canCalculate && (
                          <>
                            <Grid container className={classnames(classes.lineSpacing, 'cart-summary-shipping')}>
                              <Grid item xs className={classes.right}>
                                <Typography variant='body1'>
                                  Shipping
                                </Typography>
                              </Grid>
                              <Grid item className={classnames(classes.right, classes.summaryNumber)}>
                                <Typography variant='body1'>
                                  { order.shipping ? renderUICurrencyFromJSON(order.currency, order.shipping) : 'Free' }
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container className='cart-summary-tax'>
                              <Grid item xs className={classes.right}>
                                <Typography variant='body1'>
                                  Tax
                                </Typography>
                              </Grid>
                              <Grid item className={classnames(classes.right, classes.summaryNumber)}>
                                <Typography variant='body1'>
                                  { renderUICurrencyFromJSON(order.currency, order.tax) }
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )
                      }

                      <Grid container className={classnames(classes.total, 'cart-summary-total')} alignItems='center'>
                        <Grid item xs className={classes.right}>
                          <Typography variant='body1'>
                            Total
                          </Typography>
                        </Grid>
                        <Grid item className={classnames(classes.right, classes.summaryNumber)}>
                          <Typography variant='h6' style={{ marginTop: '-5px'}}>
                            { renderUICurrencyFromJSON(order.currency, order.total) }
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )
                }

                {
                  cartCheckoutUrl && (
                    <Grid container className={classnames(classes.checkoutButton, 'cart-summary-checkout-button')}>
                      <Grid item xs>
                        <Link href={cartCheckoutUrl}>
                          <Button variant='contained' size='large' color='primary' fullWidth>Checkout</Button>
                        </Link>
                      </Grid>
                    </Grid>
                  )
                }
                </div>
              </div>
            </Grid>
          </>
        }
      </Grid>
    </div>
  )
})

export default Cart