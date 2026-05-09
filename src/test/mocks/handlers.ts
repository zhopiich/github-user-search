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

const mockRepos = [
  {
    id: 101,
    name: 'react-learning',
    full_name: 'alice/react-learning',
    html_url: 'https://github.com/alice/react-learning',
    description: 'Learning React through GitHub APIs',
    language: 'TypeScript',
    stargazers_count: 12,
    forks_count: 3,
    updated_at: '2026-05-01T12:00:00Z',
  },
  {
    id: 102,
    name: 'router-notes',
    full_name: 'alice/router-notes',
    html_url: 'https://github.com/alice/router-notes',
    description: null,
    language: 'JavaScript',
    stargazers_count: 5,
    forks_count: 1,
    updated_at: '2026-04-20T12:00:00Z',
  },
  {
    id: 103,
    name: 'second-page-repo',
    full_name: 'alice/second-page-repo',
    html_url: 'https://github.com/alice/second-page-repo',
    description: 'Second page repository',
    language: null,
    stargazers_count: 1,
    forks_count: 0,
    updated_at: '2026-04-01T12:00:00Z',
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
  http.get('https://api.github.com/users/:login/repos', ({ request }) => {
    const page = new URL(request.url).searchParams.get('page')
    return HttpResponse.json(page === '1' ? mockRepos.slice(0, 2) : mockRepos.slice(2))
  }),
]
