import LinkTab, { LinkTabProps } from './LinkTab'

export interface LinkTabsProps {
  data: LinkTabProps[]
  activeIndex?: number
}

const LinkTabs = ({ data, activeIndex }: LinkTabsProps) => {
  return (
    <div className="flex items-stretch rounded">
      {data.map((item, index) => (
        <LinkTab key={index} {...item} isActive={index == activeIndex} />
      ))}
    </div>
  )
}

export default LinkTabs
