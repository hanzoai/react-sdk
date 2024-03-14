'use client'

// @ts-ignore
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'
import { useCommerce, type TransactionStatus } from '../../..'
import PaymentMethods from './payment-methods'
import { ApplyTypography, Button } from '@hanzo/ui/primitives'

const PayWithCard: React.FC<{
  setCurrentStep: (currentStep: number) => void
  transactionStatus: TransactionStatus
  setTransactionStatus: (status: TransactionStatus) => void
  storePaymentInfo: (paymentInfo: any) => Promise<void>
}> = ({
  setCurrentStep,
  transactionStatus,
  setTransactionStatus,
  storePaymentInfo
}) => {
  const c = useCommerce()

  return (
    <PaymentForm
      /**
       * Identifies the calling form with a verified application ID generated from
       * the Square Application Dashboard.
       */
      applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}
      /**
       * Invoked when payment form receives the result of a tokenize generation
       * request. The result will be a valid credit card or wallet token, or an error.
       */
      cardTokenizeResponseReceived={async (token: { token: any }, verifiedBuyer: any) => {
        setTransactionStatus('paid')
        const response = await fetch("/api/pay", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            sourceId: token.token,
            amount: c.cartTotal
          }),
        });
        const res = await response.json();
        if (res.success) {
          await storePaymentInfo(res.data)
          setTransactionStatus('confirmed')
        } else {
          setTransactionStatus('error')
        }
      }}
      /**
       * Identifies the location of the merchant that is taking the payment.
       * Obtained from the Square Application Dashboard - Locations tab.
       */
      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}
    >
      <div className='flex flex-col gap-2 mt-6'>
        {transactionStatus === 'confirmed' ? (
          <ApplyTypography className='flex flex-col gap-4'>
            <h5 className='mx-auto font-nav'>Payment confirmed!</h5>
            <p className='mx-auto'>Thank you for your purchase.</p>
            <Button onClick={() => setCurrentStep(2)}>Continue</Button>
          </ApplyTypography>
        ) : transactionStatus === 'paid' ? (
          <ApplyTypography className='flex flex-col gap-4'>
            <h5 className='mx-auto font-nav'>Processing your payment...</h5>
          </ApplyTypography>
        ) : (
          <>
            <PaymentMethods/>

            {/* Imitates hanzo/ui Button and Input styles, I was unable to render the
              hanzo/ui button outright and keeping the submit form functionality*/}
            <CreditCard
              style={{
                '.input-container': {
                  borderColor: '#2D2D2D',
                  borderRadius: '6px',
                },
                '.input-container.is-focus': {
                  borderColor: '#ffffff',
                },
                '.input-container.is-error': {
                  borderColor: '#ff1600',
                },
                '.message-text': {
                  color: '#999999',
                },
                '.message-icon': {
                  color: '#999999',
                },
                '.message-text.is-error': {
                  color: '#ff1600',
                },
                '.message-icon.is-error': {
                  color: '#ff1600',
                },
                input: {
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                },
                'input::placeholder': {
                  color: '#999999',
                },
                'input.is-error': {
                  color: '#ff1600',
                },
              }}
              buttonProps={{
                className: 'font-nav h-10',
                css: {
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: '#ffffffd9',
                  },
                },
              }}
            />
          </>
        )}
      </div>
    </PaymentForm>
  )
}

export default PayWithCard