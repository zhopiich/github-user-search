import { http, HttpResponse } from 'msw'

const mockUsers = [
  { id: 1, login: 'alice', avatar_url: '', html_url: '' },
  ...Array.from({ length: 29 }, (_, index) => ({
    id: index + 2,
    login: `page-one-user-${index + 1}`,
    avatar_url: '',
    html_url: '',
  })),
  { id: 31, login: 'page-two-user', avatar_url: '', html_url: '' },
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
      avatar_url: '',
      html_url: '',
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
