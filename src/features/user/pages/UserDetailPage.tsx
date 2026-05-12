import { useParams } from 'react-router-dom'
import UserDetailLayout from '../components/UserDetailLayout'
import { useSuspenseGitHubUser } from '../hooks/useGitHubUser'
import '../user.css'

export default function UserDetailPage() {
  const { login } = useParams<{ login: string }>()

  if (!login)
    throw new Error('Missing GitHub login')

  const { data: user } = useSuspenseGitHubUser(login)

  return <UserDetailLayout user={user} />
}
