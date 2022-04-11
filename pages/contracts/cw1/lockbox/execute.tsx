import LinkTabs from 'components/LinkTabs'
import PageHeaderCW3 from 'components/lockbox/PageHeaderCW1Lockbox'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { withMetadata } from 'utils/layout'

import { cw1LockboxLinkTabs } from '../../../../components/lockbox/LinkTabs.data'

const ExecuteTab = () => {
  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Execute actions for Timelock Contract" />
        <PageHeaderCW3 />
        <LinkTabs data={cw1LockboxLinkTabs} activeIndex={2} />
      </form>
      <div className="w-full"></div>
    </div>
  )
}

export default withMetadata(ExecuteTab, { center: false })
