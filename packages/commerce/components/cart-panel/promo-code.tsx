'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'

import { Button, Form, FormControl, FormField, FormItem, Input } from '@hanzo/ui/primitives'
import getCodeDiscount from '../../util/promo-codes'
import { useSearchParams } from 'next/navigation'

const formSchema = z.object({
  code: z.string().min(1, 'Invalid code'),
})

const PromoCode = () => {
  const searchParams = useSearchParams()

  const [codeAccepted, setCodeAccepted] = useState<boolean>(false)
  const [discount, setDiscount] = useState<number>()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      getCodeDiscount(code).then((discount) => {
        if (discount) {
          form.setValue('code', code)
          setCodeAccepted(true)
          setDiscount(discount)
        }
      })
    }
  }, [searchParams])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  const applyPromoCode = async (values: z.infer<typeof formSchema>) => {
    const { code } = values
    const discount = await getCodeDiscount(code)
    if (!discount) {
      form.setError('code', { message: 'Invalid code' })
      return
    }
    setCodeAccepted(true)
    setDiscount(discount)
  }

  return (
    <div className='flex flex-col gap-2 border-t py-2'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(applyPromoCode)}>
          <div className='flex gap-2 items-center'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input {...field} placeholder='Discount or invite code' disabled={codeAccepted}/>
                  </FormControl>
                </FormItem>
              )}
            />
            {codeAccepted ? (
              <Check/>
            ) : (
              <Button variant='outline' disabled={codeAccepted} className='!w-fit !min-w-0'>Apply</Button>
            )}
          </div>
        </form>
      </Form>

      {codeAccepted && (
        <p className='flex justify-between'>
          <span className='text-muted-1'>Discount</span>
          <span className='font-semibold'>{discount}%</span>
        </p>
      )}
    </div>
  )
}

export default PromoCode
