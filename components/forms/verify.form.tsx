'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { verifyOtp } from '@/lib/mail'
import { signIn } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { register } from '@/actions/user.action'
import useTranslate from '@/hooks/use-translate'
import { toaster } from '../ui/toaster'
import { Alert, Button, Field, Fieldset, Input, PinInput } from '@chakra-ui/react'

interface Props {
  fullName: string
  email: string
  signedUp?: boolean
}

export default function VerifyForm({ fullName, email, signedUp }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { lng } = useParams()
  const { t } = useTranslate()

  const verifySchema = z.object({
    otp: z.string().length(6, { message: t('mustBeCode') }),
  })

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: '' },
  })

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    try {
      setIsLoading(true)
      await verifyOtp(email, values.otp)
      if (!signedUp) {
        await register(fullName!, email)
      }
      const promise = signIn('credentials', { fullName, email, callbackUrl: `/${lng}/home` }).then(
        () => setErrorMessage('')
      )
      toaster.promise(promise, {
        loading: { title: t('loading') },
        success: { title: t('verifiedAuthorization') },
        error: { title: t('somethingWentWrong') },
      })
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {errorMessage && (
        <Alert.Root status='error' mb={4}>
          <AlertCircle />
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      )}
      <form onSubmit={verifyForm.handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <Fieldset.Content>
            <Field.Root disabled>
              <Field.Label>{t('email')}</Field.Label>
              <Input
                value={email}
                placeholder='tulaganovok04@gmail.com'
                className='bg-secondary px-4 h-12 text-lg'
              />
            </Field.Root>
            <PinInput.Root
              {...verifyForm.register('otp')}
              invalid={!!verifyForm.formState.errors.otp}
              className='w-full space-y-2'
            >
              <PinInput.HiddenInput />
              <PinInput.Label>{t('verifyCode')}</PinInput.Label>
              <PinInput.Control className='w-full grid grid-cols-6 gap-x-2'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <PinInput.Input key={index} index={index} className='w-full bg-secondary' />
                ))}
              </PinInput.Control>
            </PinInput.Root>
            <Button
              type='submit'
              size={'lg'}
              className={'w-full bg-primary text-background text-lg font-semibold'}
              disabled={isLoading}
            >
              {t('submit')}
            </Button>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    </>
  )
}
