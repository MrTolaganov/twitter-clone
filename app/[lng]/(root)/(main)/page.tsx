import { redirect } from 'next/navigation'
import { ServerLngParams } from '@/types'

export default async function Page({ params }: ServerLngParams) {
  const { lng } = await params
  return redirect(`/${lng}/home`)
}
