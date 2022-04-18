import LinkTabs from 'components/LinkTabs'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { withMetadata } from 'utils/layout'

import { useInstantiateCW3Form } from '../../../../hooks/useInstantiateCW3Form'
import { cw3TimelockLinkTabs } from './components/LinkTabs.data'
import ManageTimelock from './components/ManageTimelock'
import PageHeaderCW3Timelock from './components/PageHeaderCW3Timelock'

const ExecuteTab = () => {
  return (
    <div>
      <form className="py-6 px-12 space-y-4">
        <NextSeo title="Execute actions for Timelock Contract" />
        <PageHeaderCW3Timelock />
        <LinkTabs data={cw3TimelockLinkTabs} activeIndex={2} />
      </form>
      <div className="w-full">
        <ManageTimelock />
      </div>
    </div>
  )
}

export default withMetadata(ExecuteTab, { center: false })
