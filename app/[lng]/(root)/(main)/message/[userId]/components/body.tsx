'use client'

import { deleteMessage, editMessage, sendChatMessage } from '@/actions/chat.action'
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MenuContent, MenuContextTrigger, MenuItem, MenuRoot } from '@/components/ui/menu'
import { toaster } from '@/components/ui/toaster'
import useTranslate from '@/hooks/use-translate'
import { UploadDropzone } from '@/lib/uploadthing'
import { IChat } from '@/types'
import { Button, Field, Fieldset, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Check, CheckCheck, Paperclip, Pencil, SendHorizontal, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  chats: IChat[]
}

export default function Body({ chats }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const [allChats, setAllChats] = useState<IChat[]>(chats)
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { userId } = useParams()
  const [edit, setEdit] = useState({ isEditing: false, messageId: '' })

  const formSchema = z.object({ message: z.string().min(1), image: z.string().optional() })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '', image: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      if (edit.isEditing) {
        const { editedChat } = await editMessage(edit.messageId, values.message)
        // @ts-ignore
        setAllChats(prev =>
          prev.map(chat =>
            chat._id === edit.messageId ? { ...editedChat, receiver: { _id: userId } } : chat
          )
        )
      } else {
        const { chat } = await sendChatMessage(
          values.message,
          values.image!,
          session?.currentUser._id!,
          userId as string
        )
        setAllChats(prev => [...prev, chat])
      }
      setEdit({ isEditing: false, messageId: '' })
      form.reset()
    } catch {
      toaster.error({ type: 'error', title: t('somethingWentWrong') })
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
      setAllChats(prev => prev.filter(chat => chat._id !== messageId))
    } catch {
      toaster.error({ type: 'error', title: t('somethingWentWrong') })
    }
  }

  const onEdit = (messageId: string, message: string) => {
    setEdit({ isEditing: true, messageId })
    form.setValue('message', message)
  }

  useEffect(() => divRef.current?.scrollIntoView({ behavior: 'smooth' }), [pathname])

  return (
    <>
      <div
        className='max-md:mb-[108px] min-h-[calc(100vh-156px)] flex justify-end flex-col mb-[56px] space-y-1 relative'
        ref={divRef}
      >
        {allChats.length === 0 ? (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span
              className='text-9xl cursor-pointer'
              onClick={() => onSubmit({ message: '🖐️', image: '' })}
            >
              🖐️
            </span>
          </div>
        ) : (
          allChats.map(({ _id, message, image, receiver, createdAt, isRead }) => (
            <div
              key={_id}
              className={`
                relative max-w-80  rounded-t-xl min-w-20
                ${
                  receiver._id === userId
                    ? 'self-end bg-blue-500/80 text-foreground rounded-bl-xl'
                    : 'self-start bg-secondary rounded-br-xl'
                }
                ${message === '🖐️' && 'text-center'}
                ${!image && 'px-2 pb-3 pt-1'}
              `}
            >
              <MenuRoot>
                <MenuContextTrigger>
                  {image ? (
                    <Image src={image} alt='Image' width={300} height={200} priority />
                  ) : (
                    message
                  )}
                  <div className='flex items-center absolute bottom-0 right-0 text-foreground'>
                    <span className='text-[8px] mr-1'>{format(createdAt, 'MMM dd HH:mm')}</span>
                    {receiver._id === userId &&
                      (isRead ? <CheckCheck size={12} /> : <Check size={12} />)}
                  </div>
                </MenuContextTrigger>
                <MenuContent className={`${receiver._id !== userId && 'hidden'}`}>
                  <MenuItem asChild value='menu-item1'>
                    <Button
                      className={`${image ? 'hidden' : 'flex items-center gap-x-2'}`}
                      onClick={() => onEdit(_id, message)}
                    >
                      <Pencil size={14} />
                      <span>{t('edit')}</span>
                    </Button>
                  </MenuItem>
                  <MenuItem value='menu-item2' asChild>
                    <Button className='flex items-center gap-x-2' onClick={() => onDelete(_id)}>
                      <Trash2 size={14} />
                      <span>{t('delete')}</span>
                    </Button>
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </div>
          ))
        )}
      </div>
      <div className='p-2 text-sm fixed z-50 bg-background items-center block w-[100vw] md:w-[calc(100vw/3)] border-t border-muted-foreground bottom-[48.8px] md:bottom-0'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Fieldset.Root>
            <Fieldset.Content className='flex items-center gap-x-2 w-full flex-row'>
              <div className='flex-1'>
                <Field.Root disabled={isLoading} invalid={!!form.formState.errors}>
                  <Input
                    placeholder={`${t('typeMessage')}...`}
                    className='bg-secondary rounded-full h-10 px-2'
                    {...form.register('message')}
                  />
                </Field.Root>
              </div>
              <div>
                <DialogRoot open={isOpen} onOpenChange={() => setIsOpen(false)}>
                  <DialogTrigger asChild>
                    <Button
                      type='button'
                      variant={'outline'}
                      disabled={isLoading}
                      className='rounded-full border border-foreground'
                    >
                      <Paperclip className='cursor-pointer' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle />
                    </DialogHeader>
                    <UploadDropzone
                      endpoint={'imageUploader'}
                      onClientUploadComplete={res => {
                        onSubmit({ message: '', image: res[0].url })
                        setIsOpen(false)
                      }}
                      config={{ appendOnPaste: true, mode: 'auto' }}
                    />
                  </DialogContent>
                </DialogRoot>
              </div>
              <div>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='rounded-full bg-primary text-background'
                >
                  <SendHorizontal className='cursor-pointer' />
                </Button>
              </div>
            </Fieldset.Content>
          </Fieldset.Root>
        </form>
      </div>
    </>
  )
}
