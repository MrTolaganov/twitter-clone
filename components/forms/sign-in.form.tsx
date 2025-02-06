'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import VerifyForm from './verify.form'
import { login } from '@/actions/user.action'
import useTranslate from '@/hooks/use-translate'
import { toaster } from '../ui/toaster'
import { sendOtp } from '@/lib/mail'
import { Alert, Fieldset, Input, Button, Field } from '@chakra-ui/react'
import { AlertCircle, Dot } from 'lucide-react'
import { DialogDescription } from '../ui/dialog'

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState<'step1' | 'step2'>('step1')
  const [userData, setUserData] = useState({ fullName: '', email: '' })
  const { t } = useTranslate()

  const signInSchema = z.object({ email: z.string().email({ message: t('invalidEmail') }) })

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true)
    const { notSignedUp, fullName } = await login(values.email.trim())
    if (notSignedUp) {
      setErrorMessage(t('notSignedUp'))
      setIsLoading(false)
      return
    }
    const promise = sendOtp(values.email.trim())
      .then(() => {
        setUserData({ fullName, email: values.email.trim() })
        setStep('step2')
        setErrorMessage('')
      })
      .finally(() => setIsLoading(false))
    toaster.promise(promise, {
      loading: { title: t('loading') },
      success: { title: t('emailSendSuccess') },
      error: { title: t('somethingWentWrong') },
    })
  }

  return step === 'step1' ? (
    <>
      <DialogDescription className='mb-4'>{t('step1')}</DialogDescription>
      {errorMessage && (
        <Alert.Root status='error' mb={4}>
          <AlertCircle />
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      )}
      <form onSubmit={signInForm.handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <Fieldset.Content>
            <Field.Root invalid={!!signInForm.formState.errors.email} disabled={isLoading}>
              <Field.Label>{t('email')}</Field.Label>
              <Input
                placeholder='tulaganovok04@gmail.com'
                {...signInForm.register('email')}
                className='px-4 h-12 text-lg bg-secondary'
              />
              <Field.ErrorText>{signInForm.formState.errors.email?.message}</Field.ErrorText>
            </Field.Root>
            <Button
              type='submit'
              className='w-full bg-primary text-background text-lg font-semibold'
              disabled={isLoading}
            >
              {t('submit')}
            </Button>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    </>
  ) : (
    <>
      <DialogDescription className='flex items-center gap-x-2 mb-4'>
        <span className='text-foreground underline cursor-pointer' onClick={() => setStep('step1')}>
          {t('step1')}
        </span>
        <Dot className='text-foreground' />
        <span>{t('step2')}</span>
      </DialogDescription>
      <VerifyForm fullName={userData.fullName} email={userData.email} signedUp />
    </>
  )
}
