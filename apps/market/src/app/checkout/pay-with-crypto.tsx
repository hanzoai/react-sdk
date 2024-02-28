'use client'
import React, { useEffect, useState } from 'react'

import { ethers } from 'ethers'

import { 
  Button, 
  Input, 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  toast 
} from '@hanzo/ui/primitives'

import { 
  type EnhHeadingBlock, 
  type ElementBlock, 
  type ScreenfulBlock, 
  ScreenfulBlockComponent, 
  type SpaceBlock 
} from '@hanzo/ui/blocks'


import { associateWalletAddressWithAccount, useCurrentUser } from '@hanzo/auth'
import { Ethereum as EthIconFromAuth }  from '@hanzo/auth/icons'

import { useCommerce } from '@hanzo/cart/service'
import { formatPrice } from '@hanzo/cart/util'
  // :aa TODO
import { CRYPTO_PAYMENT_ADDRESS } from '@/settings/checkout'

import Eth from './icons/eth'
import Btc from './icons/btc'
import Usdt from './icons/usdt'

const PayWithCrypto: React.FC<{
  setStep: (step: number) => void
}> = ({
  setStep
}) => {

  const c = useCommerce()
  const {user, setUser} = useCurrentUser()
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [selectedToken, setSelectedToken] = useState('eth')
  const [amount, setAmount] = useState<number>()
  const [availableAmount, setAvailableAmount] = useState<number>()
  const [provider, setProvider] = useState<ethers.BrowserProvider>()

  useEffect(() => {
    const newProvider = new ethers.BrowserProvider(window.ethereum)
    setProvider(newProvider)
    if (user?.walletAddress) {
      newProvider.getBalance(user?.walletAddress).then((balance) => {
        setAvailableAmount(Number(balance)/(10**18))
      })
    }
  }, [user, selectedToken])

  // Get latest USD -> ETH exchange rate
  useEffect(() => {
    const fetchPrice = () => {
      setLoadingPrice(true)
                // :aa TODO setting or env
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(res => res.json())
        .then((exchangeRate) => {
          const oneUsdInWei = (10**18) / exchangeRate.ethereum.usd
          const usdAmountInWei = oneUsdInWei * c.cartTotalValue
          setAmount(usdAmountInWei)
          setLoadingPrice(false)
        })
    }

    // Call immediately on load
    fetchPrice()

    // Then set interval to call every 30 seconds
    const interval = setInterval(fetchPrice, 30000)

    return () => clearInterval(interval)
  }, [c.cartTotalValue])

  const sendPayment = async (ether: number) => {
    try {
      if (!provider)
              // :aa TODO string table
        throw new Error('No crypto wallet found. Please install it.')
  
      await window.ethereum.send('eth_requestAccounts')

      const signer = await provider.getSigner()
      ethers.getAddress(CRYPTO_PAYMENT_ADDRESS)
      const tx = await signer.sendTransaction({
        to: CRYPTO_PAYMENT_ADDRESS,
        value: ethers.parseEther(ether.toString())
      })
      console.log({ ether, addr: CRYPTO_PAYMENT_ADDRESS })
      console.log('tx', tx)
      setStep(2)
    } catch (err) {
        // :aa TODO string table
      toast({title: 'Not enough funds in your wallet'})
    }
  }

  const connectWallet = async () => {
    if (user) {
      const res = await associateWalletAddressWithAccount(user?.email ?? '')
      if (!res.error) {
        setUser({...user, walletAddress: res.result ?? undefined})
      }
    }
  }

  let payWidget = (
    <div className='w-full mx-auto max-w-[20rem]'>
      <Button variant='outline' className='w-full flex items-center gap-2' onClick={connectWallet}>
        <EthIconFromAuth height={20}/>Connect your wallet
      </Button>
    </div>
  )
  if (user?.walletAddress) {
    payWidget = (
      <div className='flex flex-col gap-2 w-full mx-auto max-w-[20rem]'>
        <div>Cart value: {formatPrice(c.cartTotalValue)}</div>
        <Select onValueChange={(token) => setSelectedToken(token)} defaultValue='eth'>
          <SelectTrigger>
            <SelectValue defaultValue='eth' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='eth'><div className='flex items-center gap-2'><Eth height={14}/>ETH</div></SelectItem>
              {/* <SelectItem value='btc' ><div className='flex items-center gap-2'><Btc height={14}/>BTC</div></SelectItem>
              <SelectItem value='usdt' ><div className='flex items-center gap-2'><Usdt height={14}/>USDT</div></SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div>Available funds in your wallet: {availableAmount} ETH</div>
        <div>
          <Input value={amount ? amount/(10**18) : amount} contentEditable={false}/>
          <div className='relative flex items-center gap-2 -top-[32px] justify-end px-2 py-1 rounded-lg bg-muted-4 w-fit text-xs float-right mr-3'><Eth height={10}/>ETH</div>
        </div>
        <Button
          onClick={() => sendPayment(amount ? amount/(10**18) : 0)}
          disabled={!amount || loadingPrice}
        >
          Pay now
        </Button>
      </div>
    )
  }

  return (
    <ScreenfulBlockComponent 
      block={{blockType: 'screenful',
        contentColumns: [[
          {blockType: 'enh-heading',
            specifiers: 'center',
            heading: { text: `FINALIZE PAYMENT` },
          } as EnhHeadingBlock,
          {blockType: 'space', level: 1} as SpaceBlock,
          {blockType: 'element',
            element: payWidget
          } as ElementBlock,
          {blockType: 'space', level: 1} as SpaceBlock,
          {blockType: 'element',
            element: (
              <Button 
                onClick={() => setStep(0)} 
                variant='outline' 
                className='mx-auto rounded-full w-full max-w-[15rem]'
              >Back</Button>
            )
          } as ElementBlock
        ]]} as ScreenfulBlock
      }
    />
  )
}

export default PayWithCrypto
