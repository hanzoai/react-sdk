import Amex from './amex'
import Discover from './discover'
import Mastercard from './mastercard'
import Visa from './visa'

const PaymentMethods: React.FC = () => {
  return (
    <div className='flex gap-1'>
      <Amex className='w-9 h-5'/>
      <Discover className='w-9 h-5'/>
      <Mastercard className='w-9 h-5'/>
      <Visa className='w-9 h-5'/>
    </div>
  )
}

export default PaymentMethods
