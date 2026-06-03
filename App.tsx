import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './src/pages/Home'

const FIVE_MINUTES_IN_MILLISECONDS = 300000;
const MAX_QUERY_RETRY_COUNT = 2;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES_IN_MILLISECONDS,
      retry: MAX_QUERY_RETRY_COUNT,
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
