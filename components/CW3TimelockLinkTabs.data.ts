import { LinkTabProps } from 'components/LinkTab'

export const cw3TimelockLinkTabs: LinkTabProps[] = [
  {
    title: 'Instantiate',
    description: `Create a new Timelock contract`,
    href: '/contracts/cw3/timelock/instantiate',
  },
  {
    title: 'Query',
    description: `Dispatch queries for your Timelock contract`,
    href: '/contracts/cw3/timelock/query',
  },
  {
    title: 'Execute',
    description: `Execute Timelock contract actions`,
    href: '/contracts/cw3/timelock/execute',
  },
]
