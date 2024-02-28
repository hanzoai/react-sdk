'use client'
 
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hanzo/ui/primitives/form'
import { Input, Button } from '@hanzo/ui/primitives'
 
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, 'Password must be at least 2 characters'),
})
 
const EmailPasswordForm: React.FC<{onSubmit: (email: string, password: string) => void, isLoading: boolean}> = ({onSubmit, isLoading}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(({email, password}) => onSubmit(email, password))} className='text-left'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isLoading}>Sign in</Button>
      </form>
    </Form>
  )
}

export default EmailPasswordForm