'use client'

import useTranslate from '@/hooks/use-translate'
import Link from 'next/link'
import { IUser } from '@/types'
import UserCard from './user.card'
import { useParams } from 'next/navigation'
import { Card } from '@chakra-ui/react'

export default function WhoFollowCard({ users }: { users: IUser[] }) {
  const { t } = useTranslate()
  const { lng } = useParams()

  return (
    <Card.Root className='bg-secondary/75 space-y-4'>
      <Card.Header className='px-4 py-0 pt-4'>
        <Card.Title className='text-lg font-bold'>{t('whoToFollow')}</Card.Title>
      </Card.Header>
      <Card.Body className='px-4 py-0 pb-4'>
        {users.map(user => (
          <UserCard key={user._id} {...user} />
        ))}
        {users.length > 4 && (
          <Link
            href={`/${lng}/explore`}
            className='w-full p-2 block hover:bg-blue-500/10 rounded-md underline text-blue-500 text-center'
          >
            {t('showMore')}
          </Link>
        )}
      </Card.Body>
    </Card.Root>
  )
}
