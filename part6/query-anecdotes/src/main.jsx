import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import { AnecdotesContextProvider } from './AnecdotesContext'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AnecdotesContextProvider>
        <App />
      </AnecdotesContextProvider>
    </QueryClientProvider>
  </StrictMode>
)