'use client'

import { updateProfile } from '@/actions/user.action'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { useDialog } from '@/hooks/use-dialog'
import useTranslate from '@/hooks/use-translate'
import { UploadButton } from '@/lib/uploadthing'
import { IUser } from '@/types'
import { Button, Input, Textarea } from '@chakra-ui/react'
import { ArrowLeft, Camera, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function SetUp() {
  const [step, setStep] = useState(1)
  const { data: session, update } = useSession()
  const { openedProfileDialog, setOpenedProfileDialog } = useDialog()
  const { t } = useTranslate()
  const [userData, setUserData] = useState<Partial<IUser>>({} as IUser)
  const [isLoading, setIsLoading] = useState(false)

  const onClose = () => {
    setOpenedProfileDialog(false)
    setStep(1)
    setUserData(session?.currentUser as IUser)
  }

  const onSave = async () => {
    try {
      setIsLoading(true)
      const promise = updateProfile(session?.currentUser._id!, userData).then(() => {
        update()
        setOpenedProfileDialog(false)
        setStep(1)
      })
      toaster.promise(promise, {
        loading: { title: t('loading') },
        success: { title: t('profileUpdatedSuccessfully') },
        error: { title: t('somethingWentWrong') },
      })
    } catch (error: any) {
      toaster.create({ type: 'error', title: error.message as string })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setUserData(session?.currentUser as IUser)
  }, [session?.currentUser])

  return (
    <DialogRoot open={openedProfileDialog} placement={'center'}>
      <DialogContent>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className='font-bold text-lg'>{t('pickProfilePicture')}</DialogTitle>
              <DialogDescription>{t('profilePictureDescription')}</DialogDescription>
            </DialogHeader>
            <div className='relative h-72'>
              <Image
                src={
                  userData?.profileImage ||
                  'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                }
                alt={'Profile image'}
                width={200}
                height={200}
                className='rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 object-cover'
                priority
              />
              <UploadButton
                endpoint={'imageUploader'}
                onClientUploadComplete={res =>
                  setUserData(prev => ({ ...prev, profileImage: res[0].url }))
                }
                config={{ appendOnPaste: true, mode: 'auto' }}
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-full bg-transparent focus:outline-none'
                appearance={{
                  allowedContent: { display: 'none' },
                  button: {
                    width: 40,
                    height: 40,
                    borderRadius: '100%',
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                  },
                }}
                content={{ button: <Camera size={20} /> }}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle className='font-bold text-lg'>{t('pickHeader')}</DialogTitle>
              </div>
              <DialogDescription>{t('pickHeaderDescription')}</DialogDescription>
            </DialogHeader>
            <div className='h-72'>
              <div className='relative h-36 bg-secondary'>
                {userData?.backgroundImage && (
                  <div className='w-full h-24'>
                    <Image
                      src={userData.backgroundImage!}
                      alt={'Background image'}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                )}
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={res =>
                    setUserData(prev => ({ ...prev, backgroundImage: res[0].url }))
                  }
                  config={{ appendOnPaste: true, mode: 'auto' }}
                  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-full bg-transparent focus:outline-none'
                  appearance={{
                    allowedContent: { display: 'none' },
                    button: {
                      width: 40,
                      height: 40,
                      borderRadius: '100%',
                      backgroundColor: 'transparent',
                      border: '2px solid white',
                    },
                  }}
                  content={{ button: <Camera size={20} /> }}
                />
                <Image
                  src={
                    userData?.profileImage ||
                    'https://cdn.vectorstock.com/i/500p/71/90/blank-avatar-photo-icon-design-vector-30257190.avif'
                  }
                  alt={'Profile image'}
                  width={100}
                  height={100}
                  priority
                  className='rounded-full absolute left-8 -bottom-1/3 z-50 object-cover'
                />
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle className='font-bold text-lg'>{t('describeYourself')}</DialogTitle>
              </div>
              <DialogDescription>{t('bioDescription')}</DialogDescription>
            </DialogHeader>
            <div className='space-y-2 h-72 px-8'>
              <label htmlFor='bio' className='font-semibold'>{t('yourBio')}</label>
              <Textarea
                id='bio'
                rows={5}
                placeholder={t('typeYourself')}
                className='bg-secondary px-2'
                value={userData?.bio}
                onChange={e => setUserData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <DialogHeader>
              <div className='flex items-center gap-x-4'>
                <Button variant={'ghost'} onClick={() => setStep(prev => prev - 1)}>
                  <ArrowLeft />
                </Button>
                <DialogTitle className='font-bold text-lg'>{t('whereDoYouLive')}</DialogTitle>
              </div>
              <DialogDescription>{t('findAccountsThroughLocation')}</DialogDescription>
            </DialogHeader>
            <div className='space-y-2 h-72 px-8'>
              <label htmlFor='location' className='font-semibold'>Location</label>
              <Input
                placeholder={t('locationPlaceholder')}
                className='h-12 bg-secondary px-2'
                value={userData?.location || ''}
                onChange={e => setUserData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <Button
              className='absolute rounded-none'
              variant={'ghost'}
              disabled={isLoading}
              onClick={onClose}
            >
              <X size={14} />
            </Button>
            <DialogHeader className='h-96'>
              <div className='flex items-center justify-center flex-col gap-y-8 h-full'>
                <DialogTitle className='font-bold text-lg'>{t('clickToSaveUpdates')}</DialogTitle>
                <Button
                  className='rounded-full h-12 w-1/2 bg-primary text-background font-semibold px-2 text-lg'
                  disabled={isLoading}
                  onClick={onSave}
                >
                  {t('save')}
                </Button>
              </div>
            </DialogHeader>
          </>
        )}
        <Button
          className={`rounded-full h-12 bg-primary text-lg text-background font-semibold m-4 ${
            step === 5 && 'hidden'
          }`}
          onClick={() => setStep(prev => prev + 1)}
        >
          {t('next')}
        </Button>
      </DialogContent>
    </DialogRoot>
  )
}
