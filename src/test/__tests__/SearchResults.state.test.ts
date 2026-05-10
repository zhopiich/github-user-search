import type { GitHubUser } from '../../types/github'
import { describe, expect, it } from 'vitest'
import {
  getSearchResultsData,
  getSearchResultsStatus,
} from '../../features/search/components/SearchResults.state'

const users: GitHubUser[] = [{
  id: 1,
  login: 'alice',
  avatar_url: 'https://avatars.githubusercontent.com/alice',
  html_url: 'https://github.com/alice',
}]

describe('search results state', () => {
  it('returns idle when the query is empty', () => {
    expect(getSearchResultsStatus({
      query: '',
      users,
      isLoading: true,
      isError: true,
    })).toBe('idle')
  })

  it('returns loading while the first page is loading', () => {
    expect(getSearchResultsStatus({
      query: 'react',
      users: [],
      isLoading: true,
      isError: false,
    })).toBe('loading')
  })

  it('returns error when the query fails', () => {
    expect(getSearchResultsStatus({
      query: 'react',
      users: [],
      isLoading: false,
      isError: true,
    })).toBe('error')
  })

  it('returns empty when the query succeeds without users', () => {
    expect(getSearchResultsStatus({
      query: 'missing',
      users: [],
      isLoading: false,
      isError: false,
    })).toBe('empty')
  })

  it('returns success when users exist', () => {
    expect(getSearchResultsStatus({
      query: 'react',
      users,
      isLoading: false,
      isError: false,
    })).toBe('success')
  })

  it('returns data with users and pagination display state', () => {
    expect(getSearchResultsData({
      users,
      hasNextPage: true,
      isFetchingNextPage: true,
    })).toEqual({
      users,
      pagination: {
        hasMore: true,
        isLoadingMore: true,
      },
    })
  })
})
