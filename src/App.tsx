import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import { PageErrorFallback, PageLoadingFallback } from './components/RouteFallbacks'
import FavoritesPage from './pages/FavoritesPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import UserDetailPage from './pages/UserDetailPage'
import UserOverviewRoute from './pages/UserOverviewRoute'
import UserReposRoute from './pages/UserReposRoute'
import { useAuthStore } from './store/authStore'
import './App.css'

const queryClient = new QueryClient()

function UserDetailRoute() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ error, resetErrorBoundary }) => (
            <PageErrorFallback error={error} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PageLoadingFallback label="Loading user..." />}>
            <UserDetailPage />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default function App() {
  const hydrateToken = useAuthStore(s => s.hydrateToken)

  useEffect(() => {
    hydrateToken()
  }, [hydrateToken])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/user/:login" element={<UserDetailRoute />}>
              <Route index element={<UserOverviewRoute />} />
              <Route path="repos" element={<UserReposRoute />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
