import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hanzo/ui/primitives/form'
import { Input } from '@hanzo/ui/primitives'
import type { UseFormReturn } from 'react-hook-form'
 
const ContactInfo: React.FC<{
  form: UseFormReturn<{
    name: string
    email: string
  }, any, {
    name: string
    email: string
  }>,
}> = ({
  form,
}) => {
  return (
    <Form {...form}>
      <form className='text-left'>
        <div className='flex gap-1 sm:gap-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='space-y-1 w-full'>
                <FormControl>
                  <Input {...field} className='border-muted-4' placeholder='Full name'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1 w-full'>
                <FormControl>
                  <Input {...field} className='border-muted-4' placeholder='Email'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}

export default ContactInfo