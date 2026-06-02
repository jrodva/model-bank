import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './src/pages/Home'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
