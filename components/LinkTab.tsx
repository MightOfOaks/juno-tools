import clsx from 'clsx'

import Anchor from './Anchor'

export type LinkTabProps = {
  title: string
  description: string
  href: string
  isActive?: boolean
}

const LinkTab = (props: LinkTabProps) => {
  const { title, description, href, isActive } = props

  return (
    <Anchor
      href={href}
      className={clsx(
        'p-4 space-y-1 rounded border-2',
        isActive ? 'border-plumbus' : 'border-transparent',
        isActive ? 'bg-plumbus/5 hover:bg-plumbus/10' : 'hover:bg-white/5'
      )}
    >
      <h4 className="font-bold">{title}</h4>
      <span className="text-sm text-white/80 line-clamp-2">{description}</span>
    </Anchor>
  )
}

export default LinkTab
