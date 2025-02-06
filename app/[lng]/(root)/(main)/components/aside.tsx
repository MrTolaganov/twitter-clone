import WhoFollowCard from '@/components/cards/who-follow.card'
import { IUser } from '@/types'

export default function Aside({ users }: { users: IUser[] }) {
  return (
    <div className='h-[95vh] border-l border-muted-foreground max-md:hidden fixed bg-background left-[calc(2*100vw/3)] !z-50 top-[5vh] w-[calc(100vw/3)] p-4'>
      {users.length > 0 && <WhoFollowCard users={users} />}
    </div>
  )
}
