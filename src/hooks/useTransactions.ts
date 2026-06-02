import { useInfiniteQuery } from '@tanstack/react-query'
import type { ListItemData } from '@vacacode/ui'
import { fetchTransactions } from '../api/transactions'
import type { Transaction } from '../types/transaction'

const formatAmount = (value: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

const toListItem = (tx: Transaction): ListItemData => {
  return {
    id: tx.id,
    variant: tx.type,
    status: tx.status,
    label: tx.label.name,
    subtitle: formatAmount(tx.amount.value, tx.amount.currency),
    imageUri: tx.label.imageUrl ?? undefined,
    flagged: tx.flagged,
  }
}

export const useTransactions = () => {
  const query = useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: ({ pageParam }) => fetchTransactions(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
  const items: ListItemData[] = query.data?.pages.flatMap((page) => page.items.map(toListItem)) ?? []
  const { isLoading, isFetchingNextPage, hasNextPage, error, fetchNextPage } = query

  return {
    items,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
  }
}
