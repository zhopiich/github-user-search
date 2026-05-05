import { http, HttpResponse } from 'msw'

function avatarUrl(login: string) {
  return `https://avatars.githubusercontent.com/${login}`
}

const mockUsers = [
  { id: 1, login: 'alice', avatar_url: avatarUrl('alice'), html_url: 'https://github.com/alice' },
  ...Array.from({ length: 29 }, (_, index) => ({
    id: index + 2,
    login: `page-one-user-${index + 1}`,
    avatar_url: avatarUrl(`page-one-user-${index + 1}`),
    html_url: `https://github.com/page-one-user-${index + 1}`,
  })),
  {
    id: 31,
    login: 'page-two-user',
    avatar_url: avatarUrl('page-two-user'),
    html_url: 'https://github.com/page-two-user',
  },
]

export const handlers = [
  http.get('https://api.github.com/search/users', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q')
    if (q === 'fail')
      return HttpResponse.json({ message: 'Validation Failed' }, { status: 422 })

    const page = new URL(request.url).searchParams.get('page')
    return HttpResponse.json({
      total_count: mockUsers.length,
      items: page === '1' ? mockUsers.slice(0, 30) : mockUsers.slice(30),
    })
  }),
  http.get('https://api.github.com/users/:login', ({ params }) => {
    return HttpResponse.json({
      id: 1,
      login: params.login,
      avatar_url: avatarUrl(String(params.login)),
      html_url: `https://github.com/${params.login}`,
      name: 'Alice',
      bio: null,
      public_repos: 10,
      followers: 5,
      following: 3,
      blog: null,
      location: null,
    })
  }),
]
