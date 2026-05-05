import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import { PageErrorFallback, PageLoadingFallback } from './components/RouteFallbacks'
import FavoritesPage from './pages/FavoritesPage'
import SearchPage from './pages/SearchPage'
import UserDetailPage from './pages/UserDetailPage'
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
  const [token, setToken] = useState('')

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchPage token={token} onTokenChange={setToken} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/user/:login" element={<UserDetailRoute />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
