export interface TransactionAmount {
  value: number
  currency: string
}

export interface TransactionLabel {
  name: string
  imageUrl: string | null
}

export interface Transaction {
  id: string
  type: 'inbound' | 'outbound'
  status: 'pending' | 'confirmed'
  amount: TransactionAmount
  label: TransactionLabel
  category: string
  date: string
  flagged: boolean
}

export interface TransactionsResponse {
  items: Transaction[]
  nextCursor: string | null
}
