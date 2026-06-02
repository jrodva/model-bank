import type { TransactionsResponse } from '../types/transaction'

const BASE_URL = 'http://localhost:3000'

export const fetchTransactions = async(
  cursor?: string,
  limit = 20,
): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({ limit: String(limit) })

  if (cursor) {
    params.set('cursor', cursor)
  }

  const res = await fetch(`${BASE_URL}/items?${params}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`)
  }

  return await res.json() as Promise<TransactionsResponse>
}
