import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTransactions } from '../api/transactions'
import type { Transaction, TransactionsResponse } from '../types/transaction'
import { useTransactions } from './useTransactions'

vi.mock('../api/transactions')

const mockedFetch = vi.mocked(fetchTransactions)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper;
}

const makeTx = (overrides: Partial<Transaction> = {}): Transaction => {
  return {
    id: 'tx-000001',
    type: 'inbound',
    status: 'confirmed',
    amount: { value: 100, currency: 'USD' },
    label: { name: 'Spotify', imageUrl: null },
    category: 'food',
    date: '2024-01-01T00:00:00.000Z',
    flagged: false,
    ...overrides,
  }
}

const makeResponse = (overrides: Partial<TransactionsResponse> = {}): TransactionsResponse => (
  { items: [makeTx()], nextCursor: null, ...overrides }
)

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in loading state with no items', () => {
    mockedFetch.mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.items).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('returns items mapped to ListItemData after a successful fetch', async () => {
    mockedFetch.mockResolvedValue(makeResponse())
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({
      id: 'tx-000001',
      variant: 'inbound',
      status: 'confirmed',
      label: 'Spotify',
      subtitle: '$100.00',
      imageUri: undefined,
      flagged: false,
    })
  })

  it('converts non-null imageUrl to imageUri', async () => {
    mockedFetch.mockResolvedValue(
      makeResponse({
        items: [makeTx({ label: { name: 'Uber', imageUrl: 'https://example.com/img.png' } })],
      }),
    )
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items[0].imageUri).toBe('https://example.com/img.png')
  })

  it('converts null imageUrl to undefined imageUri', async () => {
    mockedFetch.mockResolvedValue(makeResponse())
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items[0].imageUri).toBeUndefined()
  })

  it('formats amount as currency string using en-US locale', async () => {
    mockedFetch.mockResolvedValue(
      makeResponse({ items: [makeTx({ amount: { value: 1234.56, currency: 'USD' } })] }),
    )
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items[0].subtitle).toBe('$1,234.56')
  })

  it('passes flagged true through to the list item', async () => {
    mockedFetch.mockResolvedValue(makeResponse({ items: [makeTx({ flagged: true })] }))
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items[0].flagged).toBe(true)
  })

  it('reports hasNextPage false when nextCursor is null', async () => {
    mockedFetch.mockResolvedValue(makeResponse({ nextCursor: null }))
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.hasNextPage).toBe(false)
  })

  it('reports hasNextPage true when nextCursor is present', async () => {
    mockedFetch.mockResolvedValue(makeResponse({ nextCursor: '20' }))
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.hasNextPage).toBe(true)
  })

  it('fetches the next page with the cursor from the previous response', async () => {
    mockedFetch
      .mockResolvedValueOnce(makeResponse({ items: [makeTx({ id: 'tx-000001' })], nextCursor: '20' }))
      .mockResolvedValueOnce(makeResponse({ items: [makeTx({ id: 'tx-000002' })], nextCursor: null }))

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.fetchNextPage()
    await waitFor(() => expect(result.current.isLoadingMore).toBe(false))

    expect(mockedFetch).toHaveBeenCalledTimes(2)
    expect(mockedFetch).toHaveBeenNthCalledWith(2, '20')
  })

  it('flattens items from multiple pages into a single list', async () => {
    mockedFetch
      .mockResolvedValueOnce(makeResponse({ items: [makeTx({ id: 'tx-000001' })], nextCursor: '20' }))
      .mockResolvedValueOnce(makeResponse({ items: [makeTx({ id: 'tx-000002' })], nextCursor: null }))

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.fetchNextPage()
    await waitFor(() => expect(result.current.isLoadingMore).toBe(false))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.items.map((i) => i.id)).toEqual(['tx-000001', 'tx-000002'])
  })

  it('exposes the error and returns empty items when the fetch fails', async () => {
    mockedFetch.mockRejectedValue(new Error('Failed to fetch transactions: 500'))
    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.error).toBeTruthy())

    expect(result.current.error?.message).toBe('Failed to fetch transactions: 500')
    expect(result.current.items).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })
})
