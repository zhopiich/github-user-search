import { http, HttpResponse } from 'msw'

const mockUsers = [
  { id: 1, login: 'alice', avatar_url: '', html_url: '' },
  { id: 2, login: 'bob', avatar_url: '', html_url: '' },
]

export const handlers = [
  http.get('https://api.github.com/search/users', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q')
    if (q === 'fail')
      return HttpResponse.json({ message: 'Validation Failed' }, { status: 422 })
    return HttpResponse.json({ total_count: 2, items: mockUsers })
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
