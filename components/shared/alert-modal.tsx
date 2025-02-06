'use client'

import { useAlert } from '@/hooks/use-alert'
import { deletePost } from '@/actions/post.action'
import { useParams, useRouter } from 'next/navigation'
import useTranslate from '@/hooks/use-translate'
import { toaster } from '../ui/toaster'
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '@chakra-ui/react'

export default function AlertModal() {
  const { openedAlert, postId, setOpenedAlert } = useAlert()
  const router = useRouter()
  const { t } = useTranslate()
  const { lng } = useParams()

  const onDelete = () => {
    const promise = deletePost(postId)
      .then(() => router.push(`/${lng}/home`))
      .finally(() => setOpenedAlert(false))
    toaster.promise(promise, {
      loading: { title: t('loading') },
      success: { title: t('postDeletedSuccessfully') },
      error: { title: t('somethingWentWrong') },
    })
  }

  return (
    <DialogRoot role='alertdialog' placement={'center'} open={openedAlert} onOpenChange={() => setOpenedAlert(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center font-semibold text-lg'>{t('alertDialogTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{t('alertDialogDescription')}</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant={'outline'} className='border border-primary font-semibold px-2' onClick={() => setOpenedAlert(false)}>
              {t('cancel')}
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button className='bg-red-500 hover:bg-red-500 text-white px-2 font-semibold' onClick={onDelete}>
              {t('continue')}
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
