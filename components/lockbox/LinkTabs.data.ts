import { LinkTabProps } from 'components/LinkTab'

export const cw1LockboxLinkTabs: LinkTabProps[] = [
  {
    title: 'Instantiate',
    description: `Create a new Lockbox contract`,
    href: '/contracts/cw1/lockbox/instantiate',
  },
  {
    title: 'Query',
    description: `Dispatch queries for your Lockbox contract`,
    href: '/contracts/cw1/lockbox/query',
  },
  {
    title: 'Execute',
    description: `Execute Lockbox contract actions`,
    href: '/contracts/cw1/lockbox/execute',
  },
]
