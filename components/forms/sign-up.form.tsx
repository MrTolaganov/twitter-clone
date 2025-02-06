'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkUser } from '@/actions/user.action'
import { useState } from 'react'
import { AlertCircle, Dot } from 'lucide-react'
import VerifyForm from './verify.form'
import { DialogDescription } from '../ui/dialog'
import { sendOtp } from '@/lib/mail'
import useTranslate from '@/hooks/use-translate'
import { toaster } from '../ui/toaster'
import { Alert, Button, Field, Fieldset, Input } from '@chakra-ui/react'

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState<'step1' | 'step2'>('step1')
  const [userData, setUserData] = useState({ fullName: '', email: '' })
  const { t } = useTranslate()

  const signUpSchema = z.object({
    fullName: z.string().min(2, { message: t('mustBeFullName') }),
    email: z.string().email({ message: t('invalidEmail') }),
  })

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '' },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true)
    const { isSignedUp } = await checkUser(values.email.trim())
    if (isSignedUp) {
      setErrorMessage(t('signedUpEmail'))
      setIsLoading(false)
      return
    }
    const promise = sendOtp(values.email.trim())
      .then(() => {
        setStep('step2')
        setUserData({ fullName: values.fullName.trim(), email: values.email.trim() })
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
      <form onSubmit={signUpForm.handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <Fieldset.Content>
            <Field.Root disabled={isLoading} invalid={!!signUpForm.formState.errors.fullName}>
              <Field.Label>{t('fullName')}</Field.Label>
              <Input
                placeholder='Otabek Tulaganov'
                {...signUpForm.register('fullName')}
                className='px-4 h-12 text-lg bg-secondary'
              />
              <Field.ErrorText>{signUpForm.formState.errors.fullName?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!signUpForm.formState.errors.email} disabled={isLoading}>
              <Field.Label>{t('email')}</Field.Label>
              <Input
                placeholder='tulaganovok04@gmail.com'
                {...signUpForm.register('email')}
                className='px-4 h-12 text-lg bg-secondary'
              />
              <Field.ErrorText>{signUpForm.formState.errors.email?.message}</Field.ErrorText>
            </Field.Root>
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
  ) : (
    <>
      <DialogDescription className='flex items-center gap-x-2 mb-4'>
        <span className='text-foreground underline cursor-pointer' onClick={() => setStep('step1')}>
          {t('step1')}
        </span>
        <Dot className='text-foreground' />
        <span>{t('step2')}</span>
      </DialogDescription>
      <VerifyForm fullName={userData.fullName} email={userData.email} />
    </>
  )
}
