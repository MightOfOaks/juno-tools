import Anchor from 'components/Anchor'
import PageHeader from 'components/PageHeader'
import { links } from 'utils/links'

const PageHeaderCW3 = () => {
  return (
    <PageHeader title="CW3 Timelock">
      CW3 is a specification for fungible tokens based on CosmWasm. Learn more
      in the{' '}
      <Anchor
        href={links['Docs CW20']}
        className="font-bold text-plumbus hover:underline"
      >
        documentation
      </Anchor>
      .
    </PageHeader>
  )
}

export default PageHeaderCW3
