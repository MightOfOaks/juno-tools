import Anchor from 'components/Anchor'
import PageHeader from 'components/PageHeader'
import { links } from 'utils/links'

const PageHeaderCW3Timelock = () => {
  return (
    <PageHeader title="CW3 Timelock">
      A smart contract that relays execute function calls on other smart
      contracts with a predetermined minimum time delay. <br />
      Learn more in the{' '}
      <Anchor
        href={links['Docs CW3-Timelock']}
        className="font-bold text-plumbus hover:underline"
      >
        documentation
      </Anchor>
      .
    </PageHeader>
  )
}

export default PageHeaderCW3Timelock
