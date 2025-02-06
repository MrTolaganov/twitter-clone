'use client'

import { getPostLikes } from '@/actions/like.action'
import UserCard from '@/components/cards/user.card'
import { toaster } from '@/components/ui/toaster'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'
import { Input } from '@chakra-ui/react'
import { Loader2, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Props {
  postId: string
}

export default function Likes({ postId }: Props) {
  const { t } = useTranslate()
  const [isLoading, setIsLoading] = useState(true)
  const [allLikedUsers, setAllLikedUsers] = useState<IUser[]>([])
  const { data: session } = useSession()
  const [query, setQuery] = useState('')

  const onGetPostLikes = () => {
    getPostLikes(postId, session?.currentUser._id!)
      .then(({ likedUsers }) => setAllLikedUsers(likedUsers))
      .catch(() => toaster.create({type:'error', title:t('somethingWentWrong')}))
      .finally(() => setIsLoading(false))
  }

  const filteredLikedusers = allLikedUsers.filter(
    user =>
      user.fullName.toLowerCase().includes(query.toLowerCase().trim()) ||
      user.username.toLowerCase().includes(query.toLowerCase().trim())
  )

  useEffect(() => {
    onGetPostLikes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='space-y-4 max-md:mb-[49px]'>
      <div className='flex items-center ml-[40px] space-y-2'>
        <Search className='text-muted-foreground mr-[-40px] pr-2 z-50' />
        <Input
          className='h-12 bg-secondary rounded-full pl-[40px]'
          placeholder={`${t('search')}...`}
          value={query}
          onChange={e => setQuery(e.target.value!)}
        />
      </div>
      <div className='px-4'>
        {isLoading ? (
          <div className='w-full py-4'>
            <Loader2 className='animate-spin mx-auto' />
          </div>
        ) : filteredLikedusers.length > 0 ? (
          filteredLikedusers.map(user => <UserCard key={user._id} {...user} />)
        ) : (
          <div className='text-center py-4'>{t('noLikesFound')}</div>
        )}
      </div>
    </div>
  )
}
