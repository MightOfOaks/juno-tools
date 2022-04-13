import { CW1LockboxInstance } from 'contracts/cw1/lockbox'

export const QUERY_TYPES = ['id', 'all'] as const

export type QueryType = typeof QUERY_TYPES[number]

export const QUERY_ENTRIES: {
  id: QueryType
  name: string
  description?: string
}[] = [
  {
    id: 'all',
    name: 'Query List',
    description: 'View list of all lockboxes',
  },
  { id: 'id', name: 'Query with ID', description: 'View specific lockbox' },
]

export interface DispatchQueryProps {
  id: number
  messages: CW1LockboxInstance | undefined
  type: QueryType
}

export const dispatchQuery = (props: DispatchQueryProps) => {
  const { id, messages, type } = props
  switch (type) {
    case 'all': {
      return messages?.getLockboxes()
    }
    case 'id': {
      return messages?.getLockbox(id)
    }

    default: {
      throw new Error('unknown query type')
    }
  }
}
