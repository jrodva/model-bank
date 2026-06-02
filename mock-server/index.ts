import express, { Request, Response } from 'express'

const app = express()
const PORT = 3000
const TOTAL_ITEMS = 1200

type TransactionType = 'inbound' | 'outbound'
type TransactionStatus = 'pending' | 'confirmed'

interface Label {
  name: string
  imageUrl: string | null
}

interface Amount {
  value: number
  currency: string
}

interface Item {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: Amount
  label: Label
  category: string
  date: string
  flagged: boolean
}

interface PaginatedResponse {
  items: Item[]
  nextCursor: string | null
}

const CATEGORIES = ['food', 'transport', 'shopping', 'utilities', 'health', 'entertainment', 'salary', 'transfer'] as const
const CURRENCIES = ['USD', 'EUR', 'GBP'] as const
const TYPES: TransactionType[] = ['inbound', 'outbound']
const STATUSES: TransactionStatus[] = ['pending', 'confirmed']
const LABELS: Label[] = [
  { name: 'Spotify', imageUrl: null },
  { name: 'Amazon', imageUrl: null },
  { name: 'Netflix Premium Subscription 4K resolution + Disney', imageUrl: null },
  { name: 'Uber', imageUrl: null },
  { name: 'Airbnb', imageUrl: null },
  { name: 'Apple', imageUrl: null },
  { name: 'Google ', imageUrl: null },
  { name: 'Salary', imageUrl: null },
  { name: 'Rent', imageUrl: null },
  { name: 'Supermarket', imageUrl: null },
]

function generateItems(): Item[] {
  const items: Item[] = []
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const label = LABELS[i % LABELS.length]
    const date = new Date(Date.now() - i * 3600 * 1000 * 6)
    items.push({
      id: `tx-${String(i).padStart(6, '0')}`,
      type: TYPES[i % 2],
      status: STATUSES[Math.floor(i / 3) % 2],
      amount: {
        value: parseFloat((Math.random() * 1000 + 1).toFixed(2)),
        currency: CURRENCIES[i % CURRENCIES.length],
      },
      label,
      category: CATEGORIES[i % CATEGORIES.length],
      date: date.toISOString(),
      flagged: i % 17 === 0,
    })
  }
  return items
}

const ALL_ITEMS = generateItems()

app.get('/items', (req: Request, res: Response<PaginatedResponse>) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
  const cursor = req.query.cursor as string | undefined
  const startIndex = cursor ? parseInt(cursor, 10) : 0

  if (isNaN(startIndex) || startIndex < 0 || startIndex >= TOTAL_ITEMS) {
    res.json({ items: [], nextCursor: null })
    return
  }

  const endIndex = Math.min(startIndex + limit, TOTAL_ITEMS)
  const items = ALL_ITEMS.slice(startIndex, endIndex)
  const nextCursor = endIndex < TOTAL_ITEMS ? String(endIndex) : null

  res.json({ items, nextCursor })
})

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`)
  console.log(`Total items: ${TOTAL_ITEMS}`)
})
