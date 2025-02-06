'use client'

import UserCard from '@/components/cards/user.card'
import { useSearchQuery } from '@/hooks/use-search-query'
import useTranslate from '@/hooks/use-translate'
import { IUser } from '@/types'

interface Props {
  exploredUsers: IUser[]
}

export default function UsersList({ exploredUsers }: Props) {
  const { t } = useTranslate()
  const { query } = useSearchQuery()

  const filteredUsers = exploredUsers.filter(
    ({ fullName, username }) =>
      fullName.toLowerCase().includes(query.toLowerCase().trim()) ||
      username.toLowerCase().includes(query.toLowerCase().trim())
  )

  return (
    <div className='px-4 py-2 max-md:pt-[120px] md:pt-[64px]'>
      {filteredUsers.length > 0 ? (
        filteredUsers.map(user => <UserCard key={user._id} {...user} />)
      ) : (
        <div className='text-center py-4'>{t('noUsersFound')}</div>
      )}
    </div>
  )
}
