import { links } from 'utils/links'

import Anchor from '../Anchor'
import PageHeader from '../PageHeader'

const PageHeaderCW1Lockbox = () => {
  return (
    <PageHeader title="CW1 Lockbox">
      Learn more in the{' '}
      <Anchor
        href={links['Docs CW1Lockbox']}
        className="font-bold text-plumbus hover:underline"
      >
        documentation
      </Anchor>
      .
    </PageHeader>
  )
}

export default PageHeaderCW1Lockbox
