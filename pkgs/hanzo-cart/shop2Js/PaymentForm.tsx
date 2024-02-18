import raf from 'raf'
import React, { useMemo } from 'react'
import { isRequired } from '@hanzo/middleware'
import { EnhHeadingBlockComponent, type EnhHeadingBlock } from '@hanzo/ui/blocks'
import { usePaymentInputs } from 'react-payment-inputs'
import useMidstream from './hooks'
import { Lock } from 'lucide-react'
import { Button, Checkbox, Input, Label } from '@hanzo/ui/primitives'

const PaymentForm = ({
  payment,
  setPayment,
  setFormAwait,
  isActive,
  paymentIcon,
  paymentTitle,
}) => {
  const {
    meta,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
  } = usePaymentInputs()
  const { erroredInputs, touchedInputs } = meta

  const {
    setName,
    setNumber,
    setCvc,
    setMonth,
    setYear,
    err,
    run,
  } = useMidstream(
    {
      name: [isRequired],
      number: [isRequired],
      cvc: [isRequired],
      month: [isRequired],
      year: [isRequired],
    },
    {
      dst: (k, v) => {
        setPayment(k, v)
      },
    },
  )

  const { ...cardNumberProps } = getCardNumberProps({
    onBlur: (e) => {
      setNumber(e.target.value)
    },
    onChange: (e) => {
      setNumber(e.target.value)
    },
  })

  const cardNumberPropsRef = cardNumberProps.ref
  delete cardNumberProps.ref

  const { ...cvcProps } = getCVCProps({
    onBlur: (e) => {
      setCvc(e.target.value)
    },
    onChange: (e) => {
      setCvc(e.target.value)
    },
  })

  const cvcPropsRef = cvcProps.ref
  delete cvcProps.ref

  const { ...expiryDateProps } = getExpiryDateProps({
    onBlur: (e) => {
      const v = e.target.value ?? ''
      const [month, year] = v.replace(/\s+/g, '').split('/')
      setMonth(`${parseInt(month, 10)}`)
      setYear(`20${year}`)
    },
    onChange: (e) => {
      const v = e.target.value ?? ''
      const [month, year] = v.replace(/\s+/g, '').split('/')
      setMonth(`${parseInt(month, 10)}`)
      setYear(`20${year}`)
    },
  })

  const expiryDatePropsRef = expiryDateProps.ref
  delete expiryDateProps.ref

  const submit = useMemo(
    () => async () => {
      const ret = await run()

      if (ret instanceof Error) {
        console.log('payment form error', ret)
        throw ret
      }
    },
    [],
  )

  if (isActive) {
    raf(() => {
      setFormAwait(submit)
    })
  }

  return (
    <div>
      <EnhHeadingBlockComponent block={{blockType: 'enh-heading',
        heading: {text: paymentTitle || 'Payment info', level: 3},
        icon: paymentIcon || <Lock />,
        byline: {text: 'Guaranteed safe & secure checkout.', level: 0}} as EnhHeadingBlock
      }/>
      <div className='flex gap-4'>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name on Card</Label>
          <Input id="name" onChange={(e) => setName(e.target.value ?? '')} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Number</Label>
          <Input id="name" placeholder='0000 0000 0000 0000' {...cardNumberProps} />
        </div>
        <div className='flex gap-4'>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Expiry Date</Label>
            <Input id="name" placeholder='MM/YY' {...expiryDateProps} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">CVC</Label>
            <Input id="name" placeholder='123' {...cvcProps} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to terms and conditions
        </label>
      </div>
      <div className='flex justify-between mt-6'>
        <Button className='w-full sm:w-fit !min-w-[150px]' variant='ghost'>Back to Campaign</Button>
        <Button type='submit' className='w-full sm:w-fit sm:float-right !min-w-[150px]'>PAY NOW</Button>
      </div>
    </div>
  )
}

export default PaymentForm

