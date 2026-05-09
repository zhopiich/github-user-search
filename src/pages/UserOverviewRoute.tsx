import type { UserDetailOutletContext } from '../components/UserDetailLayout'
import { useOutletContext } from 'react-router-dom'
import UserOverviewPanel from '../components/UserOverviewPanel'

export default function UserOverviewRoute() {
  const { user } = useOutletContext<UserDetailOutletContext>()

  return <UserOverviewPanel user={user} />
}
