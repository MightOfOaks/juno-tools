import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/timelock/PageHeaderCW3'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { withMetadata } from 'utils/layout'

import { cw3LinkTabs } from '../../../components/timelock/LinkTabs.data'
import { useInstantiateCW3Form } from '../../../hooks/useInstantiateCW3Form'
const QueryTab: NextPage = () => {
  return (
    <form className="py-6 space-y-4">
      <NextSeo title="Instantiate CW20 Token" />

      <PageHeaderCW3 />

      <LinkTabs data={cw3LinkTabs} activeIndex={1} />
    </form>
  )
}

export default withMetadata(QueryTab, { center: false })
